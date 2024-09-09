set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    INSERT INTO public.user_giveaway_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;$function$
;


