set check_function_bodies = off;

CREATE OR REPLACE FUNCTION admin.update_giveaway_token_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    giveaway_password text;
BEGIN
    SELECT decrypted_secret INTO giveaway_password from vault.decrypted_secrets where name = 'giveaway_password';
    
    perform "net"."http_post"(
        url:='https://dropper.wtf/api/giveaways/data',
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', giveaway_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;

select cron.schedule(
    'update-giveaway-token-data',
    '*/1 * * * *',  -- This cron expression means every minute
    'SELECT admin.update_giveaway_token_data();'
);

CREATE OR REPLACE FUNCTION admin.update_listing_token_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    listing_password text;
BEGIN
    SELECT decrypted_secret INTO listing_password from vault.decrypted_secrets where name = 'listing_password';
    
    perform "net"."http_post"(
        url:='https://dropper.wtf/api/listings/data',
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', listing_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;

select cron.schedule(
    'update-listing-token-data',
    '*/1 * * * *',  -- This cron expression means every minute
    'SELECT admin.update_listing_token_data();'
);


