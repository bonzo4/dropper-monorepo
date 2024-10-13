CREATE OR REPLACE FUNCTION public.update_user_activity_points_giveaway_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$

DECLARE
    telegram_password text;
    app_url text;

BEGIN
    -- Check if tx_string is not null and update activity_points
    IF NEW.tx_string IS NOT NULL AND OLD.tx_string IS NULL THEN
        SELECT decrypted_secret INTO app_url from vault.decrypted_secrets where name = 'app_url';
        SELECT decrypted_secret INTO telegram_password from vault.decrypted_secrets where name = 'telegram_password'; 
        UPDATE public.user_giveaway_stats
        SET giveaways_created = giveaways_created + 1
        WHERE user_id = NEW.user_id;
        INSERT into public.user_activities (user_id, activity, points)
        values (new.user_id, 'Giveaway created.', 100);
        perform "net"."http_post"(
            url:=app_url || '/api/telegram/giveaway/' || new.id || '/new',
            headers:=jsonb_build_object('Content-Type', 'application/json', 'password', telegram_password),
            timeout_milliseconds:=60000
        ) as request_id;
        PERFORM cron.schedule(
        'giveaway_' || NEW.id, 
        EXTRACT(MINUTE FROM NEW.end_time) || ' ' || EXTRACT(HOUR FROM NEW.end_time) || ' ' || EXTRACT(DAY FROM NEW.end_time) || ' ' || EXTRACT(MONTH FROM   NEW.end_time) || ' *', 
        'select admin.select_and_insert_winners(' || NEW.id || ')' 
        );
    END IF;

    RETURN NEW;
END;$function$
;
