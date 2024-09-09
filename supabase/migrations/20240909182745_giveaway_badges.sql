create type "public"."giveaway_badges" as enum ('GOLD', 'FIST', 'CTO', 'MOON', 'TRENDING', 'PUMP_FUN', 'BNB', 'ETH', 'MATIC', 'SOL', 'BASE', 'DEGEN_PUMP');

drop index if exists "public"."giveaways_all_columns_idx";

alter table "public"."giveaways" drop column "badges";

drop type "public"."badges";


