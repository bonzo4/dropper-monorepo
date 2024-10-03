set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_create_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listings_created = listings_created + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Listing created.', 500);
    insert into public.listing_stats (listing_id) values (new.id);
    if new.is_cto then
        update public.giveaways
        set badges = array_append(badges, 'CTO'::giveaway_badges)
        where token_address = new.token_address;
    END IF;
    RETURN NEW;
END;$function$
;


