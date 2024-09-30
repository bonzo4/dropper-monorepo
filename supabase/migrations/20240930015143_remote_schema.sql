set check_function_bodies = off;

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


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_used_access_codes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
UPDATE public.access_codes
    SET used_count = used_count + 1
    WHERE code = NEW.access_code;
RETURN NEW;
END;$function$
;


