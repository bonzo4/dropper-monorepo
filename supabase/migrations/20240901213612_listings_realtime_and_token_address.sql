alter table "public"."listings" add column "token_address" text not null;

CREATE UNIQUE INDEX listings_token_address_key ON public.listings USING btree (token_address);

alter table "public"."listings" add constraint "listings_token_address_key" UNIQUE using index "listings_token_address_key";


alter publication supabase_realtime add table public.listings;