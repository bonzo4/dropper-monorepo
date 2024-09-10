set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_comment_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listing_comments = listing_comments + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.user_points
    SET activity_points = activity_points + 20
    where user_id = NEW.user_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_create_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_created = giveaways_created + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.user_points
    SET activity_points = activity_points + 100
    where user_id = NEW.user_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_create_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listings_created = listings_created + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.user_points
    SET activity_points = activity_points + 500
    where user_id = NEW.user_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_enter_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_entered = giveaways_entered + 1
    WHERE user_id = NEW.user_id;
    UPDATE public.user_points
    SET activity_points = activity_points + 20
    where user_id = NEW.user_id;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_winner_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_won = giveaways_won + 1
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER after_giveaway_entry_insert AFTER INSERT ON public.giveaway_entries FOR EACH ROW EXECUTE FUNCTION update_user_enter_giveaway_stats();

CREATE TRIGGER after_giveaway_winners_insert AFTER INSERT ON public.giveaway_winners FOR EACH ROW EXECUTE FUNCTION update_user_winner_giveaway_stats();

CREATE TRIGGER after_giveaway_insert AFTER INSERT ON public.giveaways FOR EACH ROW EXECUTE FUNCTION update_user_create_giveaway_stats();

CREATE TRIGGER after_listsing_comment_insert AFTER INSERT ON public.listing_comments FOR EACH ROW EXECUTE FUNCTION update_user_comment_listing_stats();

CREATE TRIGGER after_listsing_insert AFTER INSERT ON public.listings FOR EACH ROW EXECUTE FUNCTION update_user_create_listing_stats();


