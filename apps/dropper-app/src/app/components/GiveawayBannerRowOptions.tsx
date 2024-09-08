import { GiveawayBannerRow } from "@/lib/types/banner";
import GiveawayBanner from "./GiveawayBanner";

type GiveawayBannerRowOptions = {
  banners: GiveawayBannerRow[];
  width: number;
};

export default function GiveawayBannerSliderRow({
  banners,
  width,
}: GiveawayBannerRowOptions) {
  return (
    <div
      className="flex flex-row justify-center gap-2 w-full"
      style={{
        minWidth: width ? `${width}px` : "1920px",
      }}
    >
      {banners.map((banner, index) => (
        <div key={banner.id} className="flex flex-row">
          <GiveawayBanner banner={banner} index={index} />
        </div>
      ))}
    </div>
  );
}
