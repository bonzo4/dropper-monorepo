alter table "public"."giveaways" drop constraint "giveaways_user_id_fkey";

alter table "public"."giveaways" add constraint "giveaways_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE SET NULL not valid;

alter table "public"."giveaways" validate constraint "giveaways_user_id_fkey";


