alter table "public"."giveaways" add column "trending_score" numeric not null default '0'::numeric;

alter table "public"."listing_stats" drop column "bumps";

alter table "public"."listing_stats" drop column "comments";

alter table "public"."listing_stats" drop column "views";

alter table "public"."listing_stats" add column "period_bumps" bigint not null default '0'::bigint;

alter table "public"."listing_stats" add column "period_comments" bigint not null default '0'::bigint;

alter table "public"."listing_stats" add column "period_views" bigint not null default '0'::bigint;

alter table "public"."listing_stats" add column "total_bumps" bigint not null default '0'::bigint;

alter table "public"."listing_stats" add column "total_comments" bigint not null default '0'::bigint;

alter table "public"."listing_stats" add column "total_views" bigint not null default '0'::bigint;

alter table "public"."listings" add column "trending_score" numeric not null default '0'::numeric;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_listing_bump_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set total_bumps = total_bumps + 1, period_bumps = period_bumps + 1 where listing_id = new.id;
  return new;
end$function$
;

CREATE OR REPLACE FUNCTION public.update_listing_comment_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set total_comments = total_comments + 1, period_comments = period_comments + 1 where listing_id = new.listing_id;
  return new;
end$function$
;

CREATE OR REPLACE FUNCTION public.update_user_enter_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_entered = giveaways_entered + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Giveaway entered.', 20);
    UPDATE public.giveaways
    SET entries = entries + 1
    WHERE id = NEW.giveaway_id;
    UPDATE public.giveaways_stats
    SET total_entries = total_entries + 1,
    period_entries = period_entries + 1
    WHERE giveaway_id = NEW.giveaway_id;
    RETURN NEW;
END;$function$
;


