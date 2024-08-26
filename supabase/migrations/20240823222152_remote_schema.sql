CREATE TRIGGER create_dropman_trigger AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_dropman();

CREATE TRIGGER create_giveaway_stats_trigger AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_giveaway_stats();

CREATE TRIGGER on_user_login AFTER UPDATE OF updated_at ON auth.users FOR EACH ROW WHEN (((old.updated_at IS NOT NULL) AND (new.updated_at IS NOT NULL))) EXECUTE FUNCTION add_dropman_points();


create policy "Give users authenticated access to folder 1njz16_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'icons'::text) AND ((storage.foldername(name))[1] = 'private'::text) AND (auth.role() = 'authenticated'::text)));


create policy "allow anyone qjo3zs_0"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'giveaway_images'::text));


create policy "enable inser access 17c8pei_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'team_images'::text));


create policy "enable insert access 14dbbsn_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'drop_banners'::text));


create policy "enable insert access hd33wu_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'community_images'::text));


create policy "enable insert access jiskx7_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'banner_images'::text));


create policy "enable upload kp4gju_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'drop_icons'::text));



