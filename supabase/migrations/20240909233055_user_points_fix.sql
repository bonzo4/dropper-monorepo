set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_activity_points_giveaway_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if tx_string is not null and update activity_points
    IF NEW.tx_string IS NOT NULL THEN
        UPDATE public.user_points
        SET activity_points = activity_points + 100
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_create_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_created = giveaways_created + 1
    WHERE user_id = NEW.user_id;
    -- UPDATE public.user_points
    -- SET activity_points = activity_points + 100
    -- where user_id = NEW.user_id;
    update public.giveaways
    set badges = array_append(badges, 'CTO'::giveaway_badges)
    where token_address = new.token_address;
    RETURN NEW;
END;$function$
;

CREATE TRIGGER after_giveaway_update AFTER UPDATE ON public.giveaways FOR EACH ROW EXECUTE FUNCTION update_user_activity_points_giveaway_create();


