drop trigger if exists "on_listing_bump_create" on "public"."listing_bumps";

drop function if exists "public"."update_listing_bump_statsa"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_listing_bump_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set bumps = bumps + 1 where listing_id = new.listing_id;
  return new;
end$function$
;

CREATE OR REPLACE FUNCTION public.create_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.listing_stats (listing_id) values (new.id);
  return new;
end$function$
;

CREATE OR REPLACE FUNCTION public.update_listing_comment_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set comments = comments + 1 where listing_id = new.listing_id;
  return new;
end$function$
;

CREATE TRIGGER on_listing_bump_create AFTER INSERT ON public.listing_bumps FOR EACH ROW EXECUTE FUNCTION update_listing_bump_stats();


