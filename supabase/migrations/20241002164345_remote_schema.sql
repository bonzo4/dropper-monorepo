alter table "public"."giveaways" add column "is_repo" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_listing_bump_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set bumps = bumps + 1 where listing_id = new.id;
  return new;
end$function$
;

CREATE OR REPLACE FUNCTION public.update_listing_comment_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set comments = comments + 1 where listing_id = new.id;
  return new;
end$function$
;


