import Link from "next/link";
import { Falling } from "../icons";

type DesktopNavMenuProps = {
  route: string;
};

export default function DesktopNavMenu({ route }: DesktopNavMenuProps) {
  return (
    <nav className="absolute lg:flex flex-row items-center gap-11 hidden top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <Link href="/">
        {route === "/" || route.includes("/drops") ? (
          <div>
            <span className="text-primary">DROP ZONE</span>
          </div>
        ) : (
          <span className="">DROP ZONE</span>
        )}
      </Link>
      <Link
        href="/listings"
        // className="opacity-50"
      >
        {route.includes("listings") ? (
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
            <span className="text-primary">DROPMAN</span>
            <Falling className="mb-1" />
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center">
            <span className="">DROPMAN</span>
            <Falling className="mb-1" />
          </div>
        )}
      </Link>
    </nav>
  );
}
