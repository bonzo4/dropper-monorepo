alter table "public"."airdrop_banners" add column "enabled" boolean not null default false;

alter table "public"."giveaway_banners" add column "enabled" boolean not null default false;

alter table "public"."listing_banners" add column "enabled" boolean not null default false;


