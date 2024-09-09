import { ListingBannerRow } from "@/lib/types/banner";
import Image from "next/image";
import Link from "next/link";

type Props = {
  banner: ListingBannerRow;
  index: number;
};

export default function ListingBanner({ banner, index }: Props) {
  if (banner.out_url) {
    return (
      <a
        href={banner.out_url}
        target="_blank"
        rel="noreferrer"
        className="w-[324px] h-[125px] relative rounded-[10px] overflow-hidden"
      >
        <Image
          src={banner.image_url}
          alt="banner"
          width={324}
          height={125}
          className="w-auto h-auto"
          priority={index < 4}
        />
      </a>
    );
  }

  if (banner.listing_id) {
    return (
      <Link href={`/listings/${banner.listing_id}`}>
        <a className="w-[324px] h-[125px] relative rounded-[10px] overflow-hidden">
          <Image
            src={banner.image_url}
            alt="banner"
            width={324}
            height={125}
            className="w-auto h-auto"
            priority={index < 4}
          />
        </a>
      </Link>
    );
  }

  return (
    <div className="w-[324px] h-[125px] relative rounded-[10px] overflow-hidden">
      <Image
        src={banner.image_url}
        alt="banner"
        width={324}
        height={125}
        className="w-auto h-auto"
        priority={index < 4}
      />
    </div>
  );
}
