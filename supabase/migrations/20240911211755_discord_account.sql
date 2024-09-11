CREATE UNIQUE INDEX discord_accounts_discord_id_key ON public.discord_accounts USING btree (discord_id);

alter table "public"."discord_accounts" add constraint "discord_accounts_discord_id_key" UNIQUE using index "discord_accounts_discord_id_key";

alter table "public"."discord_accounts" add constraint "discord_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE CASCADE not valid;

alter table "public"."discord_accounts" validate constraint "discord_accounts_user_id_fkey";


