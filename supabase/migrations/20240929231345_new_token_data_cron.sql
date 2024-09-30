CREATE OR REPLACE FUNCTION admin.update_token_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    listing_password text;
    app_url text;
BEGIN
    SELECT decrypted_secret INTO app_url from vault.decrypted_secrets where name = 'app_url';
    SELECT decrypted_secret INTO listing_password from vault.decrypted_secrets where name = 'listing_password';
    
    perform "net"."http_post"(
        url:=app_url || '/api/tokens/data',
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', listing_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;

select cron.schedule(
    'update-token-data',
    '*/1 * * * *',  -- This cron expression means every minute
    'SELECT admin.update_token_data();'
);