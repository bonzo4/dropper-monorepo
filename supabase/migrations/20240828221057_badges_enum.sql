create type "public"."giveaway_badges" as enum ('GOLD', 'FIST', 'CTO', 'MOON', 'TRENDING', 'PUMP_FUN', 'BNB', 'ETH', 'MATIC', 'SOL', 'BASE');

alter table "public"."giveaways" alter column "badges" set data type giveaway_badges[] using "badges"::giveaway_badges[];

drop type "public"."badges";


