alter table "public"."user_codes" drop constraint "user_codes_access_code_key";

alter table "public"."user_codes" drop constraint "user_codes_pkey";

drop index if exists "public"."user_codes_access_code_key";

drop index if exists "public"."user_codes_pkey";

CREATE UNIQUE INDEX user_codes_pkey ON public.user_codes USING btree (user_id);

alter table "public"."user_codes" add constraint "user_codes_pkey" PRIMARY KEY using index "user_codes_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_listing_last_bump()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
    UPDATE public.listings
    SET last_bump = NEW.created_at
    WHERE id = NEW.listing_id;
    RETURN NEW;
END;$function$
;


