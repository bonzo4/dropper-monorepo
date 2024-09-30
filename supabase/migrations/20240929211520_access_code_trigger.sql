alter table "public"."access_codes" drop constraint "access_codes_id_key";

alter table "public"."access_codes" drop constraint "access_codes_pkey";

drop index if exists "public"."access_codes_id_key";

drop index if exists "public"."access_codes_pkey";

alter table "public"."access_codes" drop column "id";

CREATE UNIQUE INDEX access_codes_pkey ON public.access_codes USING btree (code);

alter table "public"."access_codes" add constraint "access_codes_pkey" PRIMARY KEY using index "access_codes_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_used_access_codes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
UPDATE public.access_codes
    SET used_count = used_count + 1
    WHERE code = NEW.access_code;
RETURN NEW;
END;$function$
;

CREATE TRIGGER after_access_code_used AFTER INSERT ON public.user_codes FOR EACH ROW EXECUTE FUNCTION update_used_access_codes();


