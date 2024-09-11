alter table "public"."user_listing_stats" drop column "listing_bumps";

alter table "public"."user_listing_stats" add column "listing_bumped" bigint not null default '0'::bigint;

alter table "public"."user_listing_stats" drop column "listing_bumped";

alter table "public"."user_listing_stats" add column "listing_bumps" bigint not null default '0'::bigint;


