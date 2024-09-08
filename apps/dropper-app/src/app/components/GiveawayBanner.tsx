import { GiveawayBannerRow } from "@/lib/types/banner";
import Image from "next/image";
import Link from "next/link";

type GiveawayBannerProps = {
  banner: GiveawayBannerRow;
  index: number;
};

export default function GiveawayBanner({ banner, index }: GiveawayBannerProps) {
  if (banner.out_url) {
    return (
      <a
        href={banner.out_url}
        target="_blank"
        rel="noreferrer"
        className="w-[324px] h-[125px] relative rounded-[10px]  overflow-hidden"
      >
        <Image
          src={banner.image_url}
          alt="banner"
          width={324}
          height={125}
          priority={index < 4}
          className="w-auto h-auto"
        />
      </a>
    );
  }

  if (banner.giveaway_id) {
    return (
      <Link href={`/drops/${banner.giveaway_id}`}>
        <a className="w-[324px] h-[125px] relative rounded-[10px]  overflow-hidden">
          <Image
            src={banner.image_url}
            alt="banner"
            width={324}
            height={125}
            priority={index < 4}
            className="w-auto h-auto"
          />
        </a>
      </Link>
    );
  }

  return (
    <div className="w-auto  h-[125px] relative rounded-[10px]  overflow-hidden">
      <Image
        src={banner.image_url}
        alt="banner"
        width={324}
        height={125}
        priority={index < 4}
        className="w-auto h-auto"
      />
    </div>
  );
}
