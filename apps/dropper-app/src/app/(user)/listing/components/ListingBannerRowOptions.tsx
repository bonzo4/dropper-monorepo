import { ListingBannerRow } from "@repo/types/banner";
import ListingBanner from "./ListingBanner";

type Props = {
  banners: ListingBannerRow[];
  width: number;
};

export default function ListingBannerSliderRow({ banners, width }: Props) {
  return (
    <div
      className="flex flex-row justify-center gap-2 w-full"
      style={{
        minWidth: width ? `${width}px` : "1920px",
      }}
    >
      {banners.map((banner, index) => (
        <div key={index} className="flex flex-row">
          <ListingBanner banner={banner} />
        </div>
      ))}
    </div>
  );
}
