alter table "public"."giveaways" alter column "token_address" set default 'So11111111111111111111111111111111111111112'::text;

alter table "public"."giveaways" alter column "token_address" set not null;


