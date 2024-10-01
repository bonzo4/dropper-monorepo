
CREATE OR REPLACE FUNCTION admin.select_and_insert_winners_safety(giveaway_doc_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    giveaway giveaways;
    giveaway_password text;
    winner_keys text[];
    app_url text;
BEGIN
    SELECT decrypted_secret INTO app_url from vault.decrypted_secrets where name = 'app_url';
    SELECT decrypted_secret INTO giveaway_password from vault.decrypted_secrets where name = 'giveaway_password'; 
    SELECT * into giveaway from public.giveaways WHERE id = giveaway_doc_id;
    
    SELECT array_agg(wallet_key) INTO winner_keys
    FROM public.giveaway_winners
    WHERE giveaway_id = giveaway_doc_id;
    
    perform "net"."http_post"(
        url:=app_url || '/api/giveaways/' || giveaway_doc_id || '/winner/set',
        body:=json_build_object('winners', array_to_json(winner_keys))::jsonb,
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', giveaway_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;