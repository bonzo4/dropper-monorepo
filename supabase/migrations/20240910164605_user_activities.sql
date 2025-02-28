create table "public"."user_activities" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "activity" text not null,
    "points" bigint not null
);


alter table "public"."user_activities" enable row level security;

CREATE UNIQUE INDEX user_activities_pkey ON public.user_activities USING btree (id);

alter table "public"."user_activities" add constraint "user_activities_pkey" PRIMARY KEY using index "user_activities_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_activity_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update user_points for the referrer
    UPDATE public.user_points
    SET activity_points = activity_points + new.points
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_activity_points_giveaway_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Check if tx_string is not null and update activity_points
    IF NEW.tx_string IS NOT NULL AND OLD.tx_string IS NULL THEN
        UPDATE public.user_giveaway_stats
        SET giveaways_created = giveaways_created + 1
        WHERE user_id = NEW.user_id;
        INSERT into public.user_activities (user_id, activity, points)
        values (new.user_id, 'Giveaway created.', 100);
        update public.giveaways
        set badges = array_append(badges, 'CTO'::giveaway_badges)
        where token_address = new.token_address;
    END IF;

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_bump_listing_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_listing_stats
    SET listing_bumps = listing_bumps + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Listing bumped.', 500);
    RETURN NEW;
END;$function$
;

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
    RETURN NEW;
END;$function$
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
    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_user_winner_giveaway_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    -- Increment the giveaways_created count for the user
    UPDATE public.user_giveaway_stats
    SET giveaways_won = giveaways_won + 1
    WHERE user_id = NEW.user_id;
    INSERT into public.user_activities (user_id, activity, points)
    values (new.user_id, 'Giveaway won.', 100);
    RETURN NEW;
END;$function$
;

grant delete on table "public"."user_activities" to "anon";

grant insert on table "public"."user_activities" to "anon";

grant references on table "public"."user_activities" to "anon";

grant select on table "public"."user_activities" to "anon";

grant trigger on table "public"."user_activities" to "anon";

grant truncate on table "public"."user_activities" to "anon";

grant update on table "public"."user_activities" to "anon";

grant delete on table "public"."user_activities" to "authenticated";

grant insert on table "public"."user_activities" to "authenticated";

grant references on table "public"."user_activities" to "authenticated";

grant select on table "public"."user_activities" to "authenticated";

grant trigger on table "public"."user_activities" to "authenticated";

grant truncate on table "public"."user_activities" to "authenticated";

grant update on table "public"."user_activities" to "authenticated";

grant delete on table "public"."user_activities" to "service_role";

grant insert on table "public"."user_activities" to "service_role";

grant references on table "public"."user_activities" to "service_role";

grant select on table "public"."user_activities" to "service_role";

grant trigger on table "public"."user_activities" to "service_role";

grant truncate on table "public"."user_activities" to "service_role";

grant update on table "public"."user_activities" to "service_role";

create policy "Enable select for users based on user_id"
on "public"."user_activities"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER after_user_activities_insert AFTER INSERT ON public.user_activities FOR EACH ROW EXECUTE FUNCTION update_user_activity_points();


