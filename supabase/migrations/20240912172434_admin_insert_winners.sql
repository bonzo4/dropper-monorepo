set check_function_bodies = off;

CREATE OR REPLACE FUNCTION admin.select_and_insert_winners(giveaway_doc_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    giveaway giveaways; 
    winner_ids uuid[];
    winner_keys text[];
    tx text;
BEGIN
    SELECT * into giveaway from giveaways WHERE id = giveaway_doc_id;
    
    SELECT array_agg(user_id) INTO winner_ids
    FROM giveaway_entries
    WHERE giveaway_id = giveaway_doc_id
    ORDER BY random()
    LIMIT giveaway.winner_amount;
    
    SELECT array_agg(wallet_key) INTO winner_keys
    FROM giveaway_entries
    WHERE giveaway_id = giveaway_doc_id
    AND user_id = ANY(winner_ids);
    
    INSERT INTO giveaway_winners (giveaway_id, reward_amount, user_id, wallet_key)
    SELECT giveaway_doc_id, giveaway.reward_amount / giveaway.winner_amount, user_id, wallet_key
    FROM giveaway_entries
    WHERE giveaway_id = giveaway_doc_id
    AND user_id = ANY(winner_ids)
    AND wallet_key = ANY(winner_keys);

    PERFORM cron.unschedule('giveaway_' || giveaway_doc_id);

    PERFORM http_set_curlopt('CURLOPT_TIMEOUT', '60');
    PERFORM http_set_curlopt('CURLOPT_CONNECTTIMEOUT', '60');
    
    PERFORM 
        http_post(
            'https://www.dropper.wtf/api/giveaways/' || giveaway.id || '/winner/set',
            '{ "winners": ' || array_to_json(winner_keys) || ' }',
            'application/json'
        );
    

    
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