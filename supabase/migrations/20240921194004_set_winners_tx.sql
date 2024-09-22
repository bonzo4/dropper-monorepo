alter table "public"."giveaways" add column "set_winners_error" text;

alter table "public"."giveaways" alter column "user_id" set not null;


