set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_listing_comment_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  update public.listing_stats set comments = comments + 1 where listing_id = new.listing_id;
  return new;
end$function$
;


