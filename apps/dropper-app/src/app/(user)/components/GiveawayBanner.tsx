import { GiveawayBannerRow } from "@/lib/types/banner";
import Image from "next/image";
import Link from "next/link";

type GiveawayBannerProps = {
  banner: GiveawayBannerRow;
};

export default function GiveawayBanner({ banner }: GiveawayBannerProps) {
  if (banner.out_url) {
    return (
      <a
        href={banner.out_url}
        target="_blank"
        rel="noreferrer"
        className="w-[324px] h-[125px] relative rounded-[10px]"
      >
        <Image src={banner.image_url} alt="banner" width={324} height={125} />
      </a>
    );
  }

  if (banner.giveaway_id) {
    return (
      <Link href={`/drops/${banner.giveaway_id}`}>
        <a className="w-[324px] h-[125px] relative rounded-[10px]">
          <Image src={banner.image_url} alt="banner" width={324} height={125} />
        </a>
      </Link>
    );
  }

  return (
    <div className="w-[324px] h-[125px] relative rounded-[10px]">
      <Image src={banner.image_url} alt="banner" width={324} height={125} />
    </div>
  );
}
