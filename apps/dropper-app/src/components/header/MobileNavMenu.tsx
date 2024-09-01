import Link from "next/link";
import { Dropper, Falling, Login } from "@repo/ui/Icons";
import Image from "next/image";
import { DropmanView } from "@repo/types/user";
import Button from "@repo/ui/Button";

type MobileNavMenuProps = {
  route: string;
  profile: DropmanView | null;
};

export default function MobileNavMenu({ route, profile }: MobileNavMenuProps) {
  return (
    <nav className="lg:hidden flex flex-col items-end gap-6 py-4 px-5 border-l-2 border-b-2 border-primary rounded-bl-md text-xl bg-black overflow-hidden">
      {profile ? (
        <Link
          href={"/profile"}
          className="flex flex-row items-center gap-3 mb-2"
        >
          {/* <span className="text-[#FDE400]">⚡68/100</span> */}
          <div className="flex flex-row items-center bg-secondary rounded-md p-[6px] gap-4">
            <Dropper />
            {profile.icon ? (
              <Image
                src={profile.icon}
                alt="profile icon"
                width={30}
                height={30}
                className="rounded-full"
              />
            ) : (
              <div className="w-[51px] relative rounded-full bg-placeholder h-[51px]" />
            )}
          </div>
        </Link>
      ) : (
        <Link href="/login">
          <Button className="rounded-lg bg-secondary flex flex-row items-center justify-center py-2 pr-2.5 pl-3 gap-[8px] ">
            <Login width={20} />
            <span className="relative">Login</span>
          </Button>
        </Link>
      )}
      <Link href="/">
        {route === "/" ? (
          <div>
            <span className="text-primary">DROP ZONE</span>
          </div>
        ) : (
          <span className="">DROP ZONE</span>
        )}
      </Link>
      <Link
        href="/listing"
        // className="opacity-50"
      >
        {route.includes("listing") ? (
          <div>
            <span className="text-primary">DROPBOARD</span>
          </div>
        ) : (
          <span className="">DROPBOARD</span>
        )}
      </Link>
      <Link
        href="/airdrops"
        className="opacity-50"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {route.includes("airdrops") ? (
          <div>
            <span className="text-primary">AIRDROPS</span>
          </div>
        ) : (
          <span className="">AIRDROPS</span>
        )}
      </Link>
      {/* <Link href="/burn" className="opacity-50">
        {route.includes("burn") ? (
          <div>
            <span className="text-primary">KAMIKAZESOL</span>
          </div>
        ) : (
          <span className="">KAMEKAZESOL</span>
        )}
      </Link>
      <Link href="/celebrity" className="opacity-50">
        {route.includes("celebrity") ? (
          <div>
            <span className="text-primary">PUMPARAZZI</span>
          </div>
        ) : (
          <span className="">PUMPARAZZI</span>
        )}
      </Link>
      <Link href="/partners" className="opacity-50">
        {route.includes("partners") ? (
          <div>
            <span className="text-primary">PARTNERS</span>
          </div>
        ) : (
          <span className="">PARTNERS</span>
        )}
      </Link> */}
      <Link
        href="/game"
        className="opacity-50"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {route.includes("game") ? (
          <div className="flex flex-row gap-2 items-center">
            <Falling className="mb-1" />
            <span className="text-primary">DROPMAN</span>
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <Falling className="mb-1" />
            <span className="">DROPMAN</span>
          </div>
        )}
      </Link>
    </nav>
  );
}
