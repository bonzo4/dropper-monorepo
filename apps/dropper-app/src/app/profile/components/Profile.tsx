"use client";
import Button from "@/components/ui/Button";
import { logout } from "@/lib/actions/logout";
import { ProfilePageData } from "@/lib/data/getProfilePage";
import Image from "next/image";

type ProfileProps = {
  profile: ProfilePageData;
};

export default function Profile({ profile }: ProfileProps) {
  const joinedDate = new Date(profile.created_at);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-row w-full px-4 ">
      <div className="flex flex-row grow gap-5">
        <Image
          src={profile.icon}
          width={120}
          height={120}
          alt={"icon"}
          className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]"
        />
        <div className="flex flex-col md:gap-5 max-w-[100px] lg:max-w-[250px] overflow-hidden ">
          <span className="text-xl md:text-5xl truncate">
            {profile.username}
          </span>
          <span className=" text-sm flex md:text-lg flex-col md:flex-row">
            <span>Joined At:</span>{" "}
            <span>
              {joinedDate.getMonth() + 1}/{joinedDate.getDate()}/
              {joinedDate.getFullYear()}
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row grow justify-end items-end gap-2 md:gap-5 ">
        <Button className="flex gap-1">
          <span>Edit </span> <span className="md:flex">Profile</span>
        </Button>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
