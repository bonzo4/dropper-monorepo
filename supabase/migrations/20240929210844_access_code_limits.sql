alter table "public"."access_codes" add column "limit" bigint;

alter table "public"."access_codes" add column "used_count" bigint not null default '0'::bigint;


