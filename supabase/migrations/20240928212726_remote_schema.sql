set check_function_bodies = off;

CREATE OR REPLACE FUNCTION admin.select_and_insert_winners(giveaway_doc_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    giveaway giveaways;
    giveaway_password text;
    winner_ids uuid[];
    winner_keys text[];
    tx text;
    app_url text;
BEGIN
    SELECT decrypted_secret INTO app_url from vault.decrypted_secrets where name = 'app_url';
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
        url:=app_url || '/api/giveaways/' || giveaway_doc_id || '/winner/set',
        body:=json_build_object('winners', array_to_json(winner_keys))::jsonb,
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', giveaway_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION admin.update_giveaway_token_data()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET statement_timeout TO '60s'
AS $function$
DECLARE
    giveaway_password text;
    app_url text;
BEGIN
    SELECT decrypted_secret INTO app_url from vault.decrypted_secrets where name = 'app_url';
    SELECT decrypted_secret INTO giveaway_password from vault.decrypted_secrets where name = 'giveaway_password';
    
    perform "net"."http_post"(
        url:=app_url || '/api/giveaways/data',
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', giveaway_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION admin.update_listing_token_data()
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
        url:=app_url || '/api/listings/data',
        headers:=jsonb_build_object('Content-Type', 'application/json', 'password', listing_password),
        timeout_milliseconds:=60000
    ) as request_id;
    
    RETURN;
END;
$function$
;


