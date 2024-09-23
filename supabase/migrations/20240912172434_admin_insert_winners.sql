set check_function_bodies = off;

CREATE OR REPLACE FUNCTION admin.select_and_insert_winners(giveaway_doc_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SET statement_timeout TO '60s'
 SECURITY DEFINER
AS $function$
DECLARE
    giveaway giveaways;
    giveaway_password text;
    winner_ids uuid[];
    winner_keys text[];
    tx text;
BEGIN
    SELECT decrypted_secret INTO giveaway_password from vault.decrypted_secrets where name = 'giveaway_password'; 
    SELECT * into giveaway from public.giveaways WHERE id = giveaway_doc_id;
    
    SELECT array_agg(user_id) INTO winner_ids
    FROM public.giveaway_entries
    WHERE giveaway_id = giveaway_doc_id
    ORDER BY random()
    LIMIT giveaway.winner_amount;
    
    SELECT array_agg(wallet_key) INTO winner_keys
    FROM public.giveaway_entries
    WHERE giveaway_id = giveaway_doc_id
    AND user_id = ANY(winner_ids);
    
    INSERT INTO public.giveaway_winners (giveaway_id, reward_amount, user_id, wallet_key)
    SELECT giveaway_doc_id, giveaway.reward_amount / giveaway.winner_amount, user_id, wallet_key
    FROM public.giveaway_entries
    WHERE giveaway_id = giveaway_doc_id
    AND user_id = ANY(winner_ids)
    AND wallet_key = ANY(winner_keys);

    PERFORM cron.unschedule('giveaway_' || giveaway_doc_id);
    
    perform "net"."http_post"(
        url:='https://dropper.wtf/api/giveaways/' || giveaway_doc_id || '/winner/set',
        body:=json_build_object('winners', array_to_json(winner_keys))::jsonb,
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', giveaway_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;


drop function if exists "public"."select_and_insert_winners"(giveaway_doc_id bigint);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.schedule_giveaway_job()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    PERFORM cron.schedule(
        'giveaway_' || NEW.id, 
        EXTRACT(MINUTE FROM NEW.end_time) || ' ' || EXTRACT(HOUR FROM NEW.end_time) || ' ' || EXTRACT(DAY FROM NEW.end_time) || ' ' || EXTRACT(MONTH FROM   NEW.end_time) || ' *', 
        'select admin.select_and_insert_winners(' || NEW.id || ')' 
    );
    RETURN NEW;
END;$function$
;




CREATE OR REPLACE FUNCTION public.update_user_activity_points_giveaway_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Check if tx_string is not null and update activity_points
    IF NEW.tx_string IS NOT NULL AND OLD.tx_string IS NULL THEN
        UPDATE public.user_giveaway_stats
        SET giveaways_created = giveaways_created + 1
        WHERE user_id = NEW.user_id;
        INSERT into public.user_activities (user_id, activity, points)
        values (new.user_id, 'Giveaway created.', 100);
        
    END IF;

    RETURN NEW;
END;$function$
;