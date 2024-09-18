"use client";
import { ProfilePageData } from "@/lib/data/profile/getProfilePage";
import { createSupabaseClient } from "@repo/lib/supabase";
import { useState } from "react";
import { toast } from "react-toastify";
import ProfileIconUpload from "./ProfileIconUpload";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";

type Options = {
  profile: ProfilePageData;
};

export default function EditProfile({ profile }: Options) {
  const supabase = createSupabaseClient();

  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [icon, setIcon] = useState(profile.icon);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) {
      toast.error("Username is required");
      return;
    }
    if (!icon) {
      toast.error("Icon is required");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("dropmans")
      .update({ username, icon })
      .eq("user_id", profile.user_id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated");
    }
    setLoading(false);
    setShowModal(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  if (!showModal)
    return <Button onClick={() => setShowModal(true)}>Edit</Button>;

  return (
    <div className="z-20 absolute bg-opacity-75 bg-black flex items-center justify-center w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="relative bg-background flex flex-col px-6 py-12 gap-4 border-2 border-primary rounded-md">
        <h2 className="text-3xl">Edit Profile</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <div className="flex flex-col sm:flex-row gap-4">
            <ProfileIconUpload
              supabase={supabase}
              icon={icon}
              setIcon={setIcon}
            />
            <div className="flex flex-col items-start gap-1">
              <label htmlFor="username">Username</label>
              <Input
                value={username}
                onChange={handleUsernameChange}
                placeholder="username"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            Save
          </Button>
        </form>
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2"
        >
          <span>Close</span>
        </Button>
      </div>
    </div>
  );
}
