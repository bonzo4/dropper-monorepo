create policy "Enable read access for all users"
on "public"."solana_wallets"
as permissive
for select
to anon, authenticated
using (true);



