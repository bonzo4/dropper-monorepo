drop policy "Enable insert for authenticated users only" on "public"."listing_bumps";

drop policy "Enable select for authenticated users only" on "public"."listing_bumps";

drop policy "Enable insert for authenticated users only" on "public"."listings";

drop policy "Enable read access for all users" on "public"."whitelisted_wallets";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_dropman_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  active_config public.drop_rate_configs;
  dropman public.dropmans;
  stats public.dropman_stats;
  rate_ps numeric;
  total_mined numeric;
  ms_elapsed numeric;
begin
  SELECT * INTO active_config FROM public.drop_rate_configs WHERE is_active = true;
  SELECT * INTO dropman FROM public.dropmans WHERE user_id = new.id;
  SELECT * INTO stats FROM public.dropman_stats WHERE user_id = new.id;
  ms_elapsed := extract(EPOCH from new.updated_at - old.updated_at) * 1000;
  rate_ps := (stats.speed * active_config.speed_rate + stats.acceleration * active_config.acceleration_rate + stats.aerodynamics * active_config.aerodynamics_rate + stats.acrobatics * active_config.acceleration_rate + stats.capacity) / 5;
  total_mined := rate_ps * (ms_elapsed / 1000);
  if total_mined < stats.capacity * 25 - dropman.claim_points then
    update public.dropmans set claim_points = claim_points + total_mined where user_id = new.id;
  else
    update public.dropmans set claim_points = stats.capacity * 25 where user_id = new.id;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_dropman()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    INSERT INTO public.dropmans (username, icon, user_id)
    VALUES (COALESCE(NEW.raw_user_meta_data->>'full_name', substring(NEW.email from 1 for position('@' in NEW.email) - 1)), COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/icons/default_icon.png'), NEW.id);
    INSERT INTO public.dropman_stats (user_id) values (NEW.id);
    INSERT INTO public.dropman_gear (user_id) values (NEW.id);
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_dropmans_row()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.dropmans (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.giveaway_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin(auth_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    RETURN   (EXISTS ( SELECT 1
   FROM _user_roles
  WHERE ((_user_roles.user_id = auth_id) AND (_user_roles.role = 'ADMIN'::roles))));
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_owner(auth_id uuid, user_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.users WHERE user_id = auth_id AND id = user_id);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_writer(uid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN   (EXISTS ( SELECT 1
   FROM _user_roles
  WHERE ((_user_roles.user_id = uid) AND (_user_roles.role = 'WRITER'::roles))));
END;$function$
;

CREATE OR REPLACE FUNCTION public.schedule_giveaway_job()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    PERFORM cron.schedule(
        'giveaway_' || NEW.id, 
        EXTRACT(MINUTE FROM NEW.end_time) || ' ' || EXTRACT(HOUR FROM NEW.end_time) || ' ' || EXTRACT(DAY FROM NEW.end_time) || ' ' || EXTRACT(MONTH FROM   NEW.end_time) || ' *', 
        'select public.select_and_insert_winners(' || NEW.id || ')' 
    );
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.select_and_insert_winners(giveaway_doc_id bigint)
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

CREATE OR REPLACE FUNCTION public.update_cto_last_bump()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE public.ctos
    SET last_bump = NEW.created_at
    WHERE id = NEW.cto_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_dropman_exp_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    UPDATE public.dropman_stats
    SET exp_points = exp_points + (SELECT exp_reward FROM public.quests WHERE id = NEW.quest_id)
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_giveaway_entry_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    UPDATE public.giveaway_stats
    SET giveaways_entered = giveaways_entered + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.giveaways
    SET entries = entries + 1
    WHERE id = NEW.giveaway_id;
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_giveaway_won_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.giveaway_stats
    SET giveaways_won = giveaways_won + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

create policy "Enable insert for authenticated users only"
on "public"."listing_bumps"
as permissive
for insert
to authenticated, anon
with check (true);


create policy "Enable select for authenticated users only"
on "public"."listing_bumps"
as permissive
for select
to authenticated, anon
using (true);


create policy "Enable insert for authenticated users only"
on "public"."listings"
as permissive
for insert
to authenticated, anon
with check (true);


create policy "Enable read access for all users"
on "public"."whitelisted_wallets"
as permissive
for select
to authenticated, anon
using (true);

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('icons', 'icons', NULL, '2024-03-27 22:17:02.934026+00', '2024-03-27 22:17:02.934026+00', true, false, NULL, NULL, NULL),
	('banner_images', 'banner_images', NULL, '2024-06-09 15:53:13.82711+00', '2024-06-09 15:53:13.82711+00', true, false, NULL, '{image/*}', NULL),
	('drop_icons', 'drop_icons', NULL, '2024-06-09 15:53:30.547023+00', '2024-06-09 15:53:30.547023+00', true, false, NULL, '{image/*}', NULL),
	('drop_banners', 'drop_banners', NULL, '2024-06-09 15:53:49.798107+00', '2024-06-09 15:53:49.798107+00', true, false, NULL, NULL, NULL),
	('team_images', 'team_images', NULL, '2024-06-09 15:54:16.132005+00', '2024-06-09 15:54:16.132005+00', true, false, NULL, '{image/*}', NULL),
	('community_images', 'community_images', NULL, '2024-06-09 17:13:56.195562+00', '2024-06-09 17:13:56.195562+00', true, false, NULL, NULL, NULL),
	('giveaway_images', 'giveaway_images', NULL, '2024-07-17 03:03:51.063571+00', '2024-07-17 03:03:51.063571+00', true, false, NULL, NULL, NULL),
	('giveaway_banner_images', 'giveaway_banner_images', NULL, '2024-07-18 07:42:39.55004+00', '2024-07-18 07:42:39.55004+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('6b4c96e7-0ac5-4c5e-8cea-4164e4089350', 'icons', 'default_icon.png', NULL, '2024-03-27 22:17:43.01968+00', '2024-03-27 22:17:43.01968+00', '2024-03-27 22:17:43.01968+00', '{"eTag": "\"b0c842a73da10ed100e9bbaecc5c76ea\"", "size": 8208, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2024-03-27T22:17:43.000Z", "contentLength": 8208, "httpStatusCode": 200}', 'dcb4e480-74ac-44ab-914a-1740a689b7b8', NULL, NULL),
	('cf6da4fa-583f-48e4-98bc-611ac83abd83', 'banner_images', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:07:51.864126+00', '2024-08-26 18:07:51.864126+00', '2024-08-26 18:07:51.864126+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:07:52.000Z", "contentLength": 0, "httpStatusCode": 200}', 'ee772666-78c9-432c-acac-1292eab1c761', NULL, '{}'),
	('00c4c1b0-0b02-4343-b5d8-3072bfe1e2af', 'drop_icons', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:08:20.469751+00', '2024-08-26 18:08:20.469751+00', '2024-08-26 18:08:20.469751+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:08:21.000Z", "contentLength": 0, "httpStatusCode": 200}', 'addfda21-4204-43cd-8396-9f0c8c83a894', NULL, '{}'),
	('4af10be7-782b-40c8-a376-b9ade168a2fd', 'drop_banners', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:08:36.371361+00', '2024-08-26 18:08:36.371361+00', '2024-08-26 18:08:36.371361+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:08:37.000Z", "contentLength": 0, "httpStatusCode": 200}', '1090057b-bfca-4b56-93f2-c32edc4a192b', NULL, '{}'),
	('a4684698-5744-4a84-b5b1-c553e47c7692', 'giveaway_images', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:09:16.396306+00', '2024-08-26 18:09:16.396306+00', '2024-08-26 18:09:16.396306+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:09:17.000Z", "contentLength": 0, "httpStatusCode": 200}', 'f0fbe225-9b19-4c98-b2b0-e4c51e135663', NULL, '{}'),
	('64b9a68d-50a4-4be4-9c02-9e761250a8df', 'team_images', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:08:50.04167+00', '2024-08-26 18:08:50.04167+00', '2024-08-26 18:08:50.04167+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:08:50.000Z", "contentLength": 0, "httpStatusCode": 200}', 'd1754af0-9cca-49e2-80cc-97ea841e9637', NULL, '{}'),
	('5cc46b13-51fa-46de-8d7f-8edb935d7c0e', 'community_images', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:08:56.977816+00', '2024-08-26 18:08:56.977816+00', '2024-08-26 18:08:56.977816+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:08:57.000Z", "contentLength": 0, "httpStatusCode": 200}', 'b133ebbe-79d4-421d-96ea-e73753efbd65', NULL, '{}'),
	('ca69c90c-1e34-4d50-96b5-5b9e2b748e99', 'giveaway_banner_images', '.emptyFolderPlaceholder', NULL, '2024-08-26 18:09:24.315693+00', '2024-08-26 18:09:24.315693+00', '2024-08-26 18:09:24.315693+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-08-26T18:09:25.000Z", "contentLength": 0, "httpStatusCode": 200}', 'f5c5ab81-bb0a-4d31-a6f6-d8d53f8a01b9', NULL, '{}');



