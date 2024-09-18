drop policy "Enable read access for all users" on "public"."solana_wallets";

alter table "public"."solana_wallets" drop constraint "solana_wallets_pkey";

drop index if exists "public"."solana_wallets_pkey";

alter table "public"."solana_wallets" drop column "id";

CREATE UNIQUE INDEX solana_wallets_pkey ON public.solana_wallets USING btree (user_id);

alter table "public"."solana_wallets" add constraint "solana_wallets_pkey" PRIMARY KEY using index "solana_wallets_pkey";

create policy "Enable delete for users based on user_id"
on "public"."solana_wallets"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."solana_wallets"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."solana_wallets"
as permissive
for select
to authenticated
using (true);



