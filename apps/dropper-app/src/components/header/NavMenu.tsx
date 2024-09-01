import { PiGlobeBold } from "react-icons/pi";
import { Arrow, Contributor, Launchpad, List, Login } from "@repo/ui/Icons";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { DropmanView } from "@repo/types/user";
import Image from "next/image";
import Button from "@repo/ui/Button";
import Input from "@repo/ui/Input";

type NavMenuProps = {
  profile: DropmanView | null;
  router: AppRouterInstance;
  setIsMenuOpen: (prev: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const NavMenu = ({ profile, router, setIsMenuOpen }: NavMenuProps) => {
  return (
    <div className="relative bg-secondary flex flex-col items-start justify-center box-border min-w-[240px] text-left text-[18px] text-primary font-fff-forward py-2">
      <div className="flex flex-row items-center justify-start gap-[20px] z-[1]  lg:hidden w-full ">
        {profile ? (
          <Link
            href="/profile"
            className="flex w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <button className="flex flex-row items-center justify-start gap-[20px] text-sm text-text hover:bg-white hover:bg-opacity-10 p-3 w-full">
              {profile.icon ? (
                <Image
                  src={profile.icon}
                  alt="profile icon"
                  width={51}
                  height={51}
                  className="rounded-[50%]"
                />
              ) : (
                <div className="w-[51px] relative rounded-[50%] bg-placeholder h-[51px]" />
              )}
              <span className="relative text-[18px]">{profile.username}</span>
            </button>
          </Link>
        ) : (
          <div className="flex p-3 w-full">
            <Link
              href="/login"
              className="flex w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="flex flex-row items-center justify-center lg:hidden w-full gap-2">
                <Login width={20} />
                <span>Login</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
      {profile && (
        <div className="flex p-3 w-full lg:hidden">
          <Link
            href="/game"
            className="flex w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <Button className="flex flex-row items-center justify-center ">
              Play Dropman
            </Button>
          </Link>
        </div>
      )}
      <button
        className="flex p-3 w-full lg:hidden flex-row items-center justify-start gap-[16px] hover:bg-white hover:bg-opacity-10"
        onClick={() => router.back()}
      >
        <Arrow width={20} className="rotate-180" />
        <span className="relative text-[16px]">Back</span>
      </button>
      <Link
        href="/"
        className="flex w-full"
        onClick={() => setIsMenuOpen(false)}
      >
        <button className="flex p-3 w-full hover:bg-white hover:bg-opacity-10 gap-4 items-center">
          <PiGlobeBold size={20} />
          <span className="relative">Home</span>
        </button>
      </Link>
      <Link
        href="/drops"
        className="flex w-full"
        onClick={() => setIsMenuOpen(false)}
      >
        <button className="flex p-3 w-full hover:bg-white hover:bg-opacity-10 gap-4 items-center">
          <List width={20} />
          <span className="relative">Token List</span>
        </button>
      </Link>
      <button className="flex p-3 w-full hover:bg-white hover:bg-opacity-10 gap-4 items-center">
        <Launchpad width={20} />
        <span className="relative">Launchpad</span>
      </button>
      <button className="flex p-3 w-full hover:bg-white hover:bg-opacity-10 gap-4 items-center">
        <Contributor width={20} />
        <span className="relative">Contributor</span>
      </button>
      <div className="flex p-3 w-full  items-center lg:hidden ">
        <Input placeholder="Search" className="" />
      </div>
    </div>
  );
};

export default NavMenu;
