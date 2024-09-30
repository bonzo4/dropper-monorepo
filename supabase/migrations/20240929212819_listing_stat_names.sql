alter table "public"."listings" drop column "ath";

alter table "public"."listings" drop column "atv";

alter table "public"."listings" add column "usd_price" numeric not null default 0.0;

alter table "public"."listings" add column "volume_24h" numeric not null default 0.0;

alter table "public"."listings" alter column "is_cto" set default false;


