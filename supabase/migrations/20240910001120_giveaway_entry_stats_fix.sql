drop trigger if exists "update_giveaway_entry_stats_trigger" on "public"."giveaway_entries";

drop trigger if exists "update_giveaway_won_stats_trigger" on "public"."giveaway_entries";

drop trigger if exists "after_listsing_insert" on "public"."listings";

drop function if exists "public"."update_giveaway_entry_stats"();

drop function if exists "public"."update_giveaway_won_stats"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_enter_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_entered = giveaways_entered + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.user_points
    SET activity_points = activity_points + 20
    where user_id = NEW.user_id;
    UPDATE public.giveaways
    SET entries = entries + 1
    WHERE id = NEW.giveaway_id;
    RETURN NEW;
END;$function$
;

CREATE TRIGGER after_listing_insert AFTER INSERT ON public.listings FOR EACH ROW EXECUTE FUNCTION update_user_create_listing_stats();


