"use client";
import { DropmanView } from "@/lib/types/user";
import { usePathname, useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import Ticker from "./Ticker";
import { Dropper, HeaderLogo, Login, Menu } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import DesktopNavMenu from "./DesktopNavMenu";
import { TickerGiveaway } from "@/app/api/giveaways/tickers/route";
import { useState } from "react";
import MobileNavMenu from "./MobileNavMenu";

type HeaderProps = {
  profile: DropmanView | null;
  tickers: TickerGiveaway[];
};

export default function Header({ profile, tickers }: HeaderProps) {
  const { width } = useWindowSize();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col ">
      <div className="flex flex-col overflow-hidden">
        <Ticker width={width} tickers={tickers} />
        <div className="w-full min-h-[72px] flex flex-row items-center justify-between p-4">
          <Link href={"/"}>
            <HeaderLogo height={34} className="" />
          </Link>
          <DesktopNavMenu route={pathname} />
          <Menu
            className="lg:hidden flex hover:cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <div className="lg:flex flex-row items-center justify-end hidden">
            {profile ? (
              <Link
                href={"/profile"}
                className="flex flex-row items-center gap-4"
              >
                {/* <span className="text-[#FDE400]">⚡68/100</span> */}
                <div className="flex flex-row items-center bg-secondary rounded-md p-[6px] gap-2">
                  <Dropper />
                  <span>{profile.username}</span>
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
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex absolute right-0 -bottom-[282px] z-10">
          <MobileNavMenu route={pathname} profile={profile} />
        </div>
      )}
    </div>
  );
}
