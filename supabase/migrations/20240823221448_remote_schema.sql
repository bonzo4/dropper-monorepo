
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";

-- CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."badges" AS ENUM (
    'GOLD',
    'FIST',
    'CTO',
    'MOON',
    'TRENDING',
    'PUMP_FUN',
    'BNB',
    'ETH',
    'MATIC',
    'SOL',
    'BASE'
);

ALTER TYPE "public"."badges" OWNER TO "postgres";

CREATE TYPE "public"."rarities" AS ENUM (
    'COMMON',
    'UNCOMMON',
    'RARE',
    'MYTHIC',
    'LEGENDARY'
);

ALTER TYPE "public"."rarities" OWNER TO "postgres";

CREATE TYPE "public"."roles" AS ENUM (
    'ADMIN',
    'WRITER'
);

ALTER TYPE "public"."roles" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."add_dropman_points"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;

ALTER FUNCTION "public"."add_dropman_points"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_dropman"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    INSERT INTO public.dropmans (username, icon, user_id)
    VALUES (COALESCE(NEW.raw_user_meta_data->>'full_name', substring(NEW.email from 1 for position('@' in NEW.email) - 1)), COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/icons/default_icon.png'), NEW.id);
    INSERT INTO public.dropman_stats (user_id) values (NEW.id);
    INSERT INTO public.dropman_gear (user_id) values (NEW.id);
    RETURN NEW;
END;$$;

ALTER FUNCTION "public"."create_dropman"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_dropmans_row"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.dropmans (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."create_dropmans_row"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_giveaway_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.giveaway_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."create_giveaway_stats"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_admin"("auth_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    RETURN   (EXISTS ( SELECT 1
   FROM _user_roles
  WHERE ((_user_roles.user_id = auth_id) AND (_user_roles.role = 'ADMIN'::roles))));
END;$$;

ALTER FUNCTION "public"."is_admin"("auth_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_owner"("auth_id" "uuid", "user_id" bigint) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.users WHERE user_id = auth_id AND id = user_id);
END;
$$;

ALTER FUNCTION "public"."is_owner"("auth_id" "uuid", "user_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."is_writer"("uid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN   (EXISTS ( SELECT 1
   FROM _user_roles
  WHERE ((_user_roles.user_id = uid) AND (_user_roles.role = 'WRITER'::roles))));
END;$$;

ALTER FUNCTION "public"."is_writer"("uid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."schedule_giveaway_job"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    PERFORM cron.schedule(
        'giveaway_' || NEW.id, 
        EXTRACT(MINUTE FROM NEW.end_time) || ' ' || EXTRACT(HOUR FROM NEW.end_time) || ' ' || EXTRACT(DAY FROM NEW.end_time) || ' ' || EXTRACT(MONTH FROM   NEW.end_time) || ' *', 
        'select public.select_and_insert_winners(' || NEW.id || ')' 
    );
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."schedule_giveaway_job"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."select_and_insert_winners"("giveaway_doc_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "statement_timeout" TO '60s'
    AS $$
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
$$;

ALTER FUNCTION "public"."select_and_insert_winners"("giveaway_doc_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_cto_last_bump"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE public.ctos
    SET last_bump = NEW.created_at
    WHERE id = NEW.cto_id;
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_cto_last_bump"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_dropman_exp_points"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    UPDATE public.dropman_stats
    SET exp_points = exp_points + (SELECT exp_reward FROM public.quests WHERE id = NEW.quest_id)
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;$$;

ALTER FUNCTION "public"."update_dropman_exp_points"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_giveaway_entry_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    UPDATE public.giveaway_stats
    SET giveaways_entered = giveaways_entered + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.giveaways
    SET entries = entries + 1
    WHERE id = NEW.giveaway_id;
    RETURN NEW;
END;$$;

ALTER FUNCTION "public"."update_giveaway_entry_stats"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_giveaway_won_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE public.giveaway_stats
    SET giveaways_won = giveaways_won + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_giveaway_won_stats"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."_user_quests" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "quest_id" "text" NOT NULL
);

ALTER TABLE "public"."_user_quests" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."_user_roles" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "public"."roles" NOT NULL
);

ALTER TABLE "public"."_user_roles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_about_sections" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "order" smallint NOT NULL,
    "description" "text" NOT NULL,
    "airdrop_id" bigint NOT NULL
);

ALTER TABLE "public"."airdrop_about_sections" OWNER TO "postgres";

ALTER TABLE "public"."airdrop_about_sections" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."about_section_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."access_codes" (
    "code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" bigint NOT NULL
);

ALTER TABLE "public"."access_codes" OWNER TO "postgres";

ALTER TABLE "public"."access_codes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."access_codes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."airdrop_comments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "airdrop_id" bigint NOT NULL,
    "user_id" "uuid",
    "comment" "text",
    "up_votes" bigint DEFAULT '0'::bigint NOT NULL,
    "down_votes" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."airdrop_comments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_community_posts" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "section_id" bigint NOT NULL,
    "url" "text" NOT NULL,
    "order" smallint NOT NULL
);

ALTER TABLE "public"."airdrop_community_posts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_community_sections" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "airdrop_id" bigint NOT NULL,
    "order" smallint NOT NULL
);

ALTER TABLE "public"."airdrop_community_sections" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_quest_items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "quest_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "url" "text",
    "order" smallint NOT NULL
);

ALTER TABLE "public"."airdrop_quest_items" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_quest_sections" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "airdrop_id" bigint NOT NULL,
    "order" smallint NOT NULL
);

ALTER TABLE "public"."airdrop_quest_sections" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_quests" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "section_id" bigint NOT NULL,
    "exp_reward" bigint DEFAULT '5'::bigint NOT NULL,
    "title" "text" NOT NULL,
    "order" smallint NOT NULL
);

ALTER TABLE "public"."airdrop_quests" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrop_team_members" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "section_id" bigint NOT NULL,
    "image_url" "text" NOT NULL,
    "name" "text" NOT NULL,
    "role" "text" NOT NULL,
    "twitter_url" "text",
    "linkedin_url" "text",
    "telegram_url" "text",
    "order" smallint NOT NULL
);

ALTER TABLE "public"."airdrop_team_members" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."airdrops" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "icon_url" "text" NOT NULL,
    "banner_url" "text" NOT NULL,
    "site_url" "text",
    "twitter_url" "text",
    "discord_url" "text",
    "title" "text" NOT NULL,
    "symbol" "text" NOT NULL,
    "difficulty" "text" NOT NULL,
    "sentiment" bigint DEFAULT '100'::bigint NOT NULL,
    "likelihood" bigint NOT NULL,
    "category" "text" DEFAULT ''::"text" NOT NULL,
    "blockchain" "text" NOT NULL,
    "telegram_url" "text",
    "docs_url" "text",
    "slug" "text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "is_featured" boolean DEFAULT false NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "est_airdrop_size" bigint NOT NULL,
    "questers" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."airdrops" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."back_gear" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "capacity" bigint,
    "speed" bigint,
    "acrobatics" bigint,
    "aerodynamics" bigint,
    "acceleration" boolean,
    "rarity" "public"."rarities" NOT NULL,
    "is_exclusive" boolean NOT NULL
);

ALTER TABLE "public"."back_gear" OWNER TO "postgres";

COMMENT ON TABLE "public"."back_gear" IS 'This is a duplicate of chest_gear';

ALTER TABLE "public"."back_gear" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."back_gear_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."banners" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image_url" "text" NOT NULL,
    "title" "text",
    "description" "text",
    "drop_url" "text",
    "out_url" "text",
    "order" smallint,
    "drop_url_text" "text" DEFAULT 'Earn'::"text",
    "out_url_text" "text" DEFAULT 'Go'::"text"
);

ALTER TABLE "public"."banners" OWNER TO "postgres";

ALTER TABLE "public"."banners" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."banners_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."chest_gear" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "capacity" bigint,
    "speed" bigint,
    "acrobatics" bigint,
    "aerodynamics" bigint,
    "acceleration" boolean,
    "rarity" "public"."rarities" NOT NULL,
    "is_exclusive" boolean NOT NULL
);

ALTER TABLE "public"."chest_gear" OWNER TO "postgres";

COMMENT ON TABLE "public"."chest_gear" IS 'This is a duplicate of head_gear';

ALTER TABLE "public"."chest_gear" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chest_gear_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_community_posts" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."community_posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_community_sections" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."community_section_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."creator_wallets" (
    "public_key" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."creator_wallets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."listing_bumps" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "listing_id" bigint NOT NULL,
    "payer_key" bigint NOT NULL,
    "tx_string" "text" NOT NULL
);

ALTER TABLE "public"."listing_bumps" OWNER TO "postgres";

ALTER TABLE "public"."listing_bumps" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."cto_bumps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."listings" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ticker" "text" NOT NULL,
    "description" "text" NOT NULL,
    "twitter_url" "text",
    "telegram_url" "text",
    "dexscreener_url" "text",
    "creator_key" "text" NOT NULL,
    "tx_string" "text" NOT NULL,
    "last_bump" timestamp with time zone DEFAULT "now"() NOT NULL,
    "holder_count" bigint NOT NULL,
    "ath" numeric NOT NULL,
    "atv" numeric NOT NULL
);

ALTER TABLE "public"."listings" OWNER TO "postgres";

ALTER TABLE "public"."listings" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ctos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."giveaway_banners" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image_url" "text" NOT NULL,
    "out_url" "text",
    "order" smallint,
    "giveaway_id" bigint
);

ALTER TABLE "public"."giveaway_banners" OWNER TO "postgres";

COMMENT ON TABLE "public"."giveaway_banners" IS 'This is a duplicate of banners';

ALTER TABLE "public"."giveaway_banners" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."drop_banners_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_comments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."drop_comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."drop_rate_configs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "capacity_rate" numeric NOT NULL,
    "speed_rate" numeric NOT NULL,
    "acceleration_rate" numeric NOT NULL,
    "aerodynamics_rate" numeric NOT NULL,
    "accrobatics_rate" numeric NOT NULL,
    "general_rate" numeric NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."drop_rate_configs" OWNER TO "postgres";

ALTER TABLE "public"."drop_rate_configs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."drop_rate_configs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_team_members" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."drop_team_members_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."dropman_gear" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "head_id" bigint,
    "chest_id" bigint,
    "back_id" bigint,
    "legs_id" bigint,
    "feet_id" bigint
);

ALTER TABLE "public"."dropman_gear" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."dropman_stats" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "capacity" bigint DEFAULT '10'::bigint NOT NULL,
    "speed" bigint DEFAULT '10'::bigint NOT NULL,
    "acrobatics" bigint DEFAULT '10'::bigint NOT NULL,
    "aerodynamics" bigint DEFAULT '10'::bigint NOT NULL,
    "acceleration" bigint DEFAULT '10'::bigint NOT NULL,
    "exp_points" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."dropman_stats" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."dropmans" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "exp_points" bigint DEFAULT '0'::bigint NOT NULL,
    "drop_points" numeric DEFAULT '0'::numeric NOT NULL,
    "user_id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "icon" "text" DEFAULT 'https://pmlweoiqgtcwuxpclgql.supabase.co/storage/v1/object/public/icons/default_icon.png'::"text" NOT NULL,
    "has_claimed" boolean DEFAULT false NOT NULL,
    "claim_points" numeric DEFAULT '0'::numeric NOT NULL
);

ALTER TABLE "public"."dropmans" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."dropmans_view" AS
 SELECT "dropmans"."user_id",
    "dropmans"."username",
    "dropmans"."icon"
   FROM "public"."dropmans";

ALTER TABLE "public"."dropmans_view" OWNER TO "postgres";

ALTER TABLE "public"."airdrops" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."drops_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."feet_gear" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "capacity" bigint,
    "speed" bigint,
    "acrobatics" bigint,
    "aerodynamics" bigint,
    "acceleration" boolean,
    "rarity" "public"."rarities" NOT NULL,
    "is_exclusive" boolean NOT NULL
);

ALTER TABLE "public"."feet_gear" OWNER TO "postgres";

COMMENT ON TABLE "public"."feet_gear" IS 'This is a duplicate of leg_gear';

ALTER TABLE "public"."feet_gear" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."feet_gear_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."giveaway_entries" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "giveaway_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "wallet_key" "text" NOT NULL
);

ALTER TABLE "public"."giveaway_entries" OWNER TO "postgres";

COMMENT ON TABLE "public"."giveaway_entries" IS 'This is a duplicate of spl_giveaway_entries';

CREATE TABLE IF NOT EXISTS "public"."spl_giveaways" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "ticker" "text" NOT NULL,
    "status" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "winner_count" bigint NOT NULL,
    "reward_amount" numeric NOT NULL,
    "description" "text" NOT NULL,
    "token_address" "text" NOT NULL,
    "icon_url" "text" NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."spl_giveaways" OWNER TO "postgres";

ALTER TABLE "public"."spl_giveaways" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."giveaway_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."giveaway_requirements" (
    "giveaway_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "discord_url" "text",
    "telegram_url" "text",
    "dexscreener_url" "text",
    "pumpdotfun_url" "text",
    "moonshot_url" "text",
    "degenpumpfun_url" "text",
    "twitter_url" "text",
    "tweet_url" "text"
);

ALTER TABLE "public"."giveaway_requirements" OWNER TO "postgres";

COMMENT ON TABLE "public"."giveaway_requirements" IS 'This is a duplicate of spl_giveaway_requirements';

CREATE TABLE IF NOT EXISTS "public"."giveaway_stats" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "giveaways_created" bigint DEFAULT '0'::bigint NOT NULL,
    "giveaways_entered" bigint DEFAULT '0'::bigint NOT NULL,
    "giveaways_won" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."giveaway_stats" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."giveaway_winners" (
    "giveaway_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "reward_amount" numeric NOT NULL,
    "wallet_key" "text" NOT NULL,
    "has_claimed" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."giveaway_winners" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."giveaways" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "ticker" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "winner_amount" bigint NOT NULL,
    "reward_amount" numeric NOT NULL,
    "description" "text" NOT NULL,
    "token_address" "text",
    "icon_url" "text" NOT NULL,
    "badges" "public"."badges"[] NOT NULL,
    "usd_value" numeric NOT NULL,
    "entries" bigint DEFAULT '0'::bigint NOT NULL,
    "tx" "text",
    "creator_key" "text" DEFAULT ''::"text" NOT NULL,
    "rug_score" numeric
);

ALTER TABLE "public"."giveaways" OWNER TO "postgres";

COMMENT ON TABLE "public"."giveaways" IS 'This is a duplicate of spl_giveaways';

ALTER TABLE "public"."giveaways" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."giveaways_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."head_gear" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "capacity" bigint,
    "speed" bigint,
    "acrobatics" bigint,
    "aerodynamics" bigint,
    "acceleration" boolean,
    "rarity" "public"."rarities" NOT NULL,
    "is_exclusive" boolean NOT NULL
);

ALTER TABLE "public"."head_gear" OWNER TO "postgres";

COMMENT ON TABLE "public"."head_gear" IS 'This is a duplicate of items';

ALTER TABLE "public"."head_gear" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."head_gear_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."items" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "capacity" bigint NOT NULL,
    "dexterity" bigint NOT NULL,
    "rizz" bigint NOT NULL,
    "perception" bigint NOT NULL,
    "oppurtunity" bigint NOT NULL,
    "is_exclusive" boolean NOT NULL,
    "rarity" "public"."rarities" NOT NULL
);

ALTER TABLE "public"."items" OWNER TO "postgres";

ALTER TABLE "public"."items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."leg_gear" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "image" "text" NOT NULL,
    "capacity" bigint,
    "speed" bigint,
    "acrobatics" bigint,
    "aerodynamics" bigint,
    "acceleration" boolean,
    "rarity" "public"."rarities" NOT NULL,
    "is_exclusive" boolean NOT NULL
);

ALTER TABLE "public"."leg_gear" OWNER TO "postgres";

COMMENT ON TABLE "public"."leg_gear" IS 'This is a duplicate of back_gear';

ALTER TABLE "public"."leg_gear" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."leg_gear_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_quest_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quest_itmes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_quest_sections" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quest_sections_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."airdrop_quests" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."solana_wallets" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "address" "text" NOT NULL
);

ALTER TABLE "public"."solana_wallets" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_codes" (
    "access_code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_codes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."whitelisted_wallets" (
    "wallet_address" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."whitelisted_wallets" OWNER TO "postgres";

ALTER TABLE ONLY "public"."_user_quests"
    ADD CONSTRAINT "_user_quests_pkey" PRIMARY KEY ("user_id", "quest_id");

ALTER TABLE ONLY "public"."_user_roles"
    ADD CONSTRAINT "_user_roles_pkey" PRIMARY KEY ("user_id", "role");

ALTER TABLE ONLY "public"."airdrop_about_sections"
    ADD CONSTRAINT "about_section_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."access_codes"
    ADD CONSTRAINT "access_codes_code_key" UNIQUE ("code");

ALTER TABLE ONLY "public"."access_codes"
    ADD CONSTRAINT "access_codes_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."access_codes"
    ADD CONSTRAINT "access_codes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."back_gear"
    ADD CONSTRAINT "back_gear_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_order_key" UNIQUE ("order");

ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."chest_gear"
    ADD CONSTRAINT "chest_gear_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_community_posts"
    ADD CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_community_sections"
    ADD CONSTRAINT "community_section_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."creator_wallets"
    ADD CONSTRAINT "creator_wallets_pkey" PRIMARY KEY ("public_key");

ALTER TABLE ONLY "public"."listing_bumps"
    ADD CONSTRAINT "cto_bumps_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "ctos_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."giveaway_banners"
    ADD CONSTRAINT "drop_banners_order_key" UNIQUE ("order");

ALTER TABLE ONLY "public"."giveaway_banners"
    ADD CONSTRAINT "drop_banners_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_comments"
    ADD CONSTRAINT "drop_comments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."drop_rate_configs"
    ADD CONSTRAINT "drop_rate_configs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_team_members"
    ADD CONSTRAINT "drop_team_members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."dropman_stats"
    ADD CONSTRAINT "dropman_stats_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."dropmans"
    ADD CONSTRAINT "dropmans_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."dropmans"
    ADD CONSTRAINT "dropmans_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."airdrops"
    ADD CONSTRAINT "drops_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrops"
    ADD CONSTRAINT "drops_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."feet_gear"
    ADD CONSTRAINT "feet_gear_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."giveaway_entries"
    ADD CONSTRAINT "giveaway_entries_pkey1" PRIMARY KEY ("giveaway_id", "user_id");

ALTER TABLE ONLY "public"."spl_giveaways"
    ADD CONSTRAINT "giveaway_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."giveaway_requirements"
    ADD CONSTRAINT "giveaway_requirements_pkey1" PRIMARY KEY ("giveaway_id");

ALTER TABLE ONLY "public"."giveaway_stats"
    ADD CONSTRAINT "giveaway_stats_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."giveaway_winners"
    ADD CONSTRAINT "giveaway_winners_pkey" PRIMARY KEY ("giveaway_id", "user_id");

ALTER TABLE ONLY "public"."giveaways"
    ADD CONSTRAINT "giveaways_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."giveaways"
    ADD CONSTRAINT "giveaways_tx_key" UNIQUE ("tx");

ALTER TABLE ONLY "public"."head_gear"
    ADD CONSTRAINT "head_gear_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."leg_gear"
    ADD CONSTRAINT "leg_gear_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_quest_items"
    ADD CONSTRAINT "quest_itmes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_quest_sections"
    ADD CONSTRAINT "quest_sections_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."airdrop_quests"
    ADD CONSTRAINT "quests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."solana_wallets"
    ADD CONSTRAINT "solana_wallets_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."user_codes"
    ADD CONSTRAINT "user_codes_access_code_key" UNIQUE ("access_code");

ALTER TABLE ONLY "public"."user_codes"
    ADD CONSTRAINT "user_codes_pkey" PRIMARY KEY ("access_code", "user_id");

ALTER TABLE ONLY "public"."user_codes"
    ADD CONSTRAINT "user_codes_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."whitelisted_wallets"
    ADD CONSTRAINT "whitelisted_wallets_pkey" PRIMARY KEY ("wallet_address");

CREATE INDEX "drops_created_at_title_symbol_sentiment_likelihood_category_idx" ON "public"."airdrops" USING "btree" ("created_at", "title", "symbol", "sentiment", "likelihood", "category", "blockchain", "slug", "description", "is_published", "is_featured", "est_airdrop_size", "questers");

CREATE INDEX "giveaways_all_columns_idx" ON "public"."giveaways" USING "btree" ("id", "created_at", "title", "ticker", "start_time", "end_time", "winner_amount", "reward_amount", "description", "token_address", "icon_url", "badges", "usd_value", "entries", "tx", "creator_key", "rug_score");

CREATE OR REPLACE TRIGGER "cto_bump_last_bump_trigger" AFTER INSERT ON "public"."listing_bumps" FOR EACH ROW EXECUTE FUNCTION "public"."update_cto_last_bump"();

CREATE OR REPLACE TRIGGER "schedule_giveaway_job_trigger" AFTER INSERT ON "public"."giveaways" FOR EACH ROW EXECUTE FUNCTION "public"."schedule_giveaway_job"();

CREATE OR REPLACE TRIGGER "update_dropman_exp_points_trigger" AFTER INSERT ON "public"."_user_quests" FOR EACH ROW EXECUTE FUNCTION "public"."update_dropman_exp_points"();

CREATE OR REPLACE TRIGGER "update_giveaway_entry_stats_trigger" AFTER INSERT ON "public"."giveaway_entries" FOR EACH ROW EXECUTE FUNCTION "public"."update_giveaway_entry_stats"();

CREATE OR REPLACE TRIGGER "update_giveaway_won_stats_trigger" AFTER INSERT ON "public"."giveaway_entries" FOR EACH ROW EXECUTE FUNCTION "public"."update_giveaway_won_stats"();

ALTER TABLE ONLY "public"."_user_roles"
    ADD CONSTRAINT "_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_about_sections"
    ADD CONSTRAINT "about_section_drop_id_fkey" FOREIGN KEY ("airdrop_id") REFERENCES "public"."airdrops"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."banners"
    ADD CONSTRAINT "banners_drop_url_fkey" FOREIGN KEY ("drop_url") REFERENCES "public"."airdrops"("slug") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."airdrop_community_posts"
    ADD CONSTRAINT "community_posts_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."airdrop_community_sections"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_community_sections"
    ADD CONSTRAINT "community_sections_drop_id_fkey" FOREIGN KEY ("airdrop_id") REFERENCES "public"."airdrops"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_comments"
    ADD CONSTRAINT "drop_comments_drop_id_fkey" FOREIGN KEY ("airdrop_id") REFERENCES "public"."airdrops"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_comments"
    ADD CONSTRAINT "drop_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."airdrop_team_members"
    ADD CONSTRAINT "drop_team_members_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."airdrop_about_sections"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_back_id_fkey" FOREIGN KEY ("back_id") REFERENCES "public"."back_gear"("id") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_chest_id_fkey" FOREIGN KEY ("chest_id") REFERENCES "public"."chest_gear"("id") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_feet_id_fkey" FOREIGN KEY ("feet_id") REFERENCES "public"."feet_gear"("id") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_head_id_fkey" FOREIGN KEY ("head_id") REFERENCES "public"."head_gear"("id") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_legs_id_fkey" FOREIGN KEY ("legs_id") REFERENCES "public"."leg_gear"("id") ON UPDATE RESTRICT ON DELETE SET NULL;

ALTER TABLE ONLY "public"."dropman_gear"
    ADD CONSTRAINT "dropman_gear_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."dropman_stats"
    ADD CONSTRAINT "dropman_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_banners"
    ADD CONSTRAINT "giveaway_banners_giveaway_id_fkey" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_entries"
    ADD CONSTRAINT "giveaway_entries_giveaway_id_fkey" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_entries"
    ADD CONSTRAINT "giveaway_entries_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_requirements"
    ADD CONSTRAINT "giveaway_requirements_giveaway_id_fkey" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_stats"
    ADD CONSTRAINT "giveaway_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_winners"
    ADD CONSTRAINT "giveaway_winners_giveaway_id_fkey" FOREIGN KEY ("giveaway_id") REFERENCES "public"."giveaways"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."giveaway_winners"
    ADD CONSTRAINT "giveaway_winners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."listing_bumps"
    ADD CONSTRAINT "listing_bumps_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."_user_quests"
    ADD CONSTRAINT "public__user_quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."dropmans"
    ADD CONSTRAINT "public_dropmans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_quest_items"
    ADD CONSTRAINT "quest_items_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "public"."airdrop_quests"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_quest_sections"
    ADD CONSTRAINT "quest_sections_drop_id_fkey" FOREIGN KEY ("airdrop_id") REFERENCES "public"."airdrops"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."airdrop_quests"
    ADD CONSTRAINT "quests_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."airdrop_quest_sections"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."solana_wallets"
    ADD CONSTRAINT "solana_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_codes"
    ADD CONSTRAINT "user_codes_access_code_fkey" FOREIGN KEY ("access_code") REFERENCES "public"."access_codes"("code") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_codes"
    ADD CONSTRAINT "user_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

CREATE POLICY "Enable delete access for all users" ON "public"."giveaways" FOR DELETE TO "anon", "authenticated" USING (true);

CREATE POLICY "Enable delete for users based on user_id" ON "public"."airdrop_comments" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert access for anon users" ON "public"."giveaway_requirements" FOR INSERT TO "anon", "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert access for anon users" ON "public"."giveaways" FOR INSERT TO "anon", "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."airdrop_comments" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."giveaway_entries" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."giveaway_winners" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."listing_bumps" FOR INSERT TO "anon", "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."listings" FOR INSERT TO "anon", "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for users based on user_id" ON "public"."_user_quests" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."dropman_stats" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."dropmans" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."giveaway_stats" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_codes" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."access_codes" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_about_sections" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_comments" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_community_posts" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_community_sections" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_quest_items" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_quest_sections" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_quests" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrop_team_members" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."airdrops" FOR SELECT USING (("is_published" = true));

CREATE POLICY "Enable read access for all users" ON "public"."banners" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."dropman_stats" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."giveaway_banners" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."giveaway_entries" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."giveaway_requirements" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."giveaway_stats" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."giveaways" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."listings" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."user_codes" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."whitelisted_wallets" FOR SELECT TO "anon", "authenticated" USING (true);

CREATE POLICY "Enable read for users based on user_id" ON "public"."_user_quests" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable select for authenticated users only" ON "public"."giveaway_winners" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."listing_bumps" FOR SELECT TO "anon", "authenticated" USING (true);

CREATE POLICY "Enable select for users based on user_id" ON "public"."_user_roles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable select for users based on user_id" ON "public"."dropmans" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable update access for all users" ON "public"."giveaways" FOR UPDATE TO "anon", "authenticated" USING (true);

CREATE POLICY "Enable update for users based on user_id" ON "public"."dropman_stats" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable update for users based on user_id" ON "public"."giveaway_stats" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable update for users based on user_id" ON "public"."giveaway_winners" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

ALTER TABLE "public"."_user_quests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."_user_roles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."access_codes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_about_sections" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_comments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_community_posts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_community_sections" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_quest_items" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_quest_sections" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_quests" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrop_team_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."airdrops" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."back_gear" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."banners" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chest_gear" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."creator_wallets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."drop_rate_configs" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dropman_gear" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dropman_stats" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."dropmans" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enable admin access" ON "public"."airdrop_about_sections" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."airdrop_community_posts" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."airdrop_community_sections" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."airdrop_quest_items" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."airdrop_quest_sections" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."airdrop_team_members" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."airdrops" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."banners" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin access" ON "public"."items" TO "authenticated" USING ("public"."is_admin"("auth"."uid"()));

CREATE POLICY "enable admin acess" ON "public"."airdrop_quests" USING ("public"."is_admin"("auth"."uid"()));

ALTER TABLE "public"."feet_gear" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."giveaway_banners" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."giveaway_entries" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."giveaway_requirements" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."giveaway_stats" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."giveaway_winners" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."giveaways" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."head_gear" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."leg_gear" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."listing_bumps" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."listings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."solana_wallets" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."spl_giveaways" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_codes" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."whitelisted_wallets" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."dropmans";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."add_dropman_points"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_dropman_points"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_dropman_points"() TO "service_role";

GRANT ALL ON FUNCTION "public"."create_dropman"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_dropman"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_dropman"() TO "service_role";

GRANT ALL ON FUNCTION "public"."create_dropmans_row"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_dropmans_row"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_dropmans_row"() TO "service_role";

GRANT ALL ON FUNCTION "public"."create_giveaway_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_giveaway_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_giveaway_stats"() TO "service_role";

GRANT ALL ON FUNCTION "public"."is_admin"("auth_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"("auth_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"("auth_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."is_owner"("auth_id" "uuid", "user_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."is_owner"("auth_id" "uuid", "user_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_owner"("auth_id" "uuid", "user_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."is_writer"("uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_writer"("uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_writer"("uid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."schedule_giveaway_job"() TO "anon";
GRANT ALL ON FUNCTION "public"."schedule_giveaway_job"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."schedule_giveaway_job"() TO "service_role";

GRANT ALL ON FUNCTION "public"."select_and_insert_winners"("giveaway_doc_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."select_and_insert_winners"("giveaway_doc_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."select_and_insert_winners"("giveaway_doc_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_cto_last_bump"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_cto_last_bump"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_cto_last_bump"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_dropman_exp_points"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_dropman_exp_points"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_dropman_exp_points"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_giveaway_entry_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_giveaway_entry_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_giveaway_entry_stats"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_giveaway_won_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_giveaway_won_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_giveaway_won_stats"() TO "service_role";

GRANT ALL ON TABLE "public"."_user_quests" TO "anon";
GRANT ALL ON TABLE "public"."_user_quests" TO "authenticated";
GRANT ALL ON TABLE "public"."_user_quests" TO "service_role";

GRANT ALL ON TABLE "public"."_user_roles" TO "anon";
GRANT ALL ON TABLE "public"."_user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."_user_roles" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_about_sections" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_about_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_about_sections" TO "service_role";

GRANT ALL ON SEQUENCE "public"."about_section_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."about_section_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."about_section_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."access_codes" TO "anon";
GRANT ALL ON TABLE "public"."access_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."access_codes" TO "service_role";

GRANT ALL ON SEQUENCE "public"."access_codes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."access_codes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."access_codes_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_comments" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_comments" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_community_posts" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_community_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_community_posts" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_community_sections" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_community_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_community_sections" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_quest_items" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_quest_items" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_quest_items" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_quest_sections" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_quest_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_quest_sections" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_quests" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_quests" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_quests" TO "service_role";

GRANT ALL ON TABLE "public"."airdrop_team_members" TO "anon";
GRANT ALL ON TABLE "public"."airdrop_team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrop_team_members" TO "service_role";

GRANT ALL ON TABLE "public"."airdrops" TO "anon";
GRANT ALL ON TABLE "public"."airdrops" TO "authenticated";
GRANT ALL ON TABLE "public"."airdrops" TO "service_role";

GRANT ALL ON TABLE "public"."back_gear" TO "anon";
GRANT ALL ON TABLE "public"."back_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."back_gear" TO "service_role";

GRANT ALL ON SEQUENCE "public"."back_gear_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."back_gear_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."back_gear_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."banners" TO "anon";
GRANT ALL ON TABLE "public"."banners" TO "authenticated";
GRANT ALL ON TABLE "public"."banners" TO "service_role";

GRANT ALL ON SEQUENCE "public"."banners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."banners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."banners_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."chest_gear" TO "anon";
GRANT ALL ON TABLE "public"."chest_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."chest_gear" TO "service_role";

GRANT ALL ON SEQUENCE "public"."chest_gear_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chest_gear_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chest_gear_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."community_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."community_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."community_posts_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."community_section_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."community_section_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."community_section_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."creator_wallets" TO "anon";
GRANT ALL ON TABLE "public"."creator_wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."creator_wallets" TO "service_role";

GRANT ALL ON TABLE "public"."listing_bumps" TO "anon";
GRANT ALL ON TABLE "public"."listing_bumps" TO "authenticated";
GRANT ALL ON TABLE "public"."listing_bumps" TO "service_role";

GRANT ALL ON SEQUENCE "public"."cto_bumps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cto_bumps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cto_bumps_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."listings" TO "anon";
GRANT ALL ON TABLE "public"."listings" TO "authenticated";
GRANT ALL ON TABLE "public"."listings" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ctos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ctos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ctos_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."giveaway_banners" TO "anon";
GRANT ALL ON TABLE "public"."giveaway_banners" TO "authenticated";
GRANT ALL ON TABLE "public"."giveaway_banners" TO "service_role";

GRANT ALL ON SEQUENCE "public"."drop_banners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."drop_banners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."drop_banners_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."drop_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."drop_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."drop_comments_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."drop_rate_configs" TO "anon";
GRANT ALL ON TABLE "public"."drop_rate_configs" TO "authenticated";
GRANT ALL ON TABLE "public"."drop_rate_configs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."drop_rate_configs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."drop_rate_configs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."drop_rate_configs_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."drop_team_members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."drop_team_members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."drop_team_members_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."dropman_gear" TO "anon";
GRANT ALL ON TABLE "public"."dropman_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."dropman_gear" TO "service_role";

GRANT ALL ON TABLE "public"."dropman_stats" TO "anon";
GRANT ALL ON TABLE "public"."dropman_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."dropman_stats" TO "service_role";

GRANT ALL ON TABLE "public"."dropmans" TO "anon";
GRANT ALL ON TABLE "public"."dropmans" TO "authenticated";
GRANT ALL ON TABLE "public"."dropmans" TO "service_role";

GRANT ALL ON TABLE "public"."dropmans_view" TO "anon";
GRANT ALL ON TABLE "public"."dropmans_view" TO "authenticated";
GRANT ALL ON TABLE "public"."dropmans_view" TO "service_role";

GRANT ALL ON SEQUENCE "public"."drops_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."drops_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."drops_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."feet_gear" TO "anon";
GRANT ALL ON TABLE "public"."feet_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."feet_gear" TO "service_role";

GRANT ALL ON SEQUENCE "public"."feet_gear_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."feet_gear_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."feet_gear_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."giveaway_entries" TO "anon";
GRANT ALL ON TABLE "public"."giveaway_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."giveaway_entries" TO "service_role";

GRANT ALL ON TABLE "public"."spl_giveaways" TO "anon";
GRANT ALL ON TABLE "public"."spl_giveaways" TO "authenticated";
GRANT ALL ON TABLE "public"."spl_giveaways" TO "service_role";

GRANT ALL ON SEQUENCE "public"."giveaway_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."giveaway_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."giveaway_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."giveaway_requirements" TO "anon";
GRANT ALL ON TABLE "public"."giveaway_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."giveaway_requirements" TO "service_role";

GRANT ALL ON TABLE "public"."giveaway_stats" TO "anon";
GRANT ALL ON TABLE "public"."giveaway_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."giveaway_stats" TO "service_role";

GRANT ALL ON TABLE "public"."giveaway_winners" TO "anon";
GRANT ALL ON TABLE "public"."giveaway_winners" TO "authenticated";
GRANT ALL ON TABLE "public"."giveaway_winners" TO "service_role";

GRANT ALL ON TABLE "public"."giveaways" TO "anon";
GRANT ALL ON TABLE "public"."giveaways" TO "authenticated";
GRANT ALL ON TABLE "public"."giveaways" TO "service_role";

GRANT ALL ON SEQUENCE "public"."giveaways_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."giveaways_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."giveaways_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."head_gear" TO "anon";
GRANT ALL ON TABLE "public"."head_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."head_gear" TO "service_role";

GRANT ALL ON SEQUENCE "public"."head_gear_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."head_gear_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."head_gear_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."items" TO "anon";
GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."leg_gear" TO "anon";
GRANT ALL ON TABLE "public"."leg_gear" TO "authenticated";
GRANT ALL ON TABLE "public"."leg_gear" TO "service_role";

GRANT ALL ON SEQUENCE "public"."leg_gear_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."leg_gear_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."leg_gear_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."quest_itmes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quest_itmes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quest_itmes_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."quest_sections_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quest_sections_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quest_sections_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quests_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."solana_wallets" TO "anon";
GRANT ALL ON TABLE "public"."solana_wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."solana_wallets" TO "service_role";

GRANT ALL ON TABLE "public"."user_codes" TO "anon";
GRANT ALL ON TABLE "public"."user_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."user_codes" TO "service_role";

GRANT ALL ON TABLE "public"."whitelisted_wallets" TO "anon";
GRANT ALL ON TABLE "public"."whitelisted_wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."whitelisted_wallets" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
