import { WhiteArrow } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import Image from "next/image";
import { Paragraph } from "@repo/ui";
import { AirdropBannerRow } from "@/lib/types/banner";

type BannerProps = {
  banner: AirdropBannerRow;
  handleNext?: () => void;
  handlePrev?: () => void;
  index?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const Banner = ({ banner, handleNext, handlePrev, index }: BannerProps) => {
  return (
    <div className="w-full relative bg-placeholder h-[380px] overflow-hidden shrink-0 flex flex-row items-end justify-between py-2.5 px-7 md:box-border md:gap-[10px] md:max-h-[380px] text-left text-[36px] text-text font-fff-forward ">
      <div className="self-stretch flex flex-row items-center justify-center z-20 ">
        <WhiteArrow
          className="rotate-180 hover:cursor-pointer w-[32px] md:w-[54px]"
          width={54}
          onClick={handlePrev}
          style={{
            opacity: handlePrev ? 1 : 0,
          }}
        />
      </div>
      <div className="md:flex-1 overflow-hidden flex flex-col items-start justify-center py-7 md:px-14 gap-[16px] z-20 ">
        {index === 0 ? (
          <h1 className="text-2xl md:text-4xl">{banner.title}</h1>
        ) : (
          <h2 className="text-2xl md:text-4xl">{banner.title}</h2>
        )}
        <Paragraph className="max-w-[160px] md:max-w-[928px] max-h-[200px]">
          {banner.description}
        </Paragraph>
        {(banner.drop_url || banner.out_url) && (
          <div className="flex flex-row items-center justify-center gap-1 md:gap-[10px]">
            {banner.drop_url && (
              <Button className="md:px-8">
                {banner.drop_url_text || "Earn"}
              </Button>
            )}
            {banner.out_url && (
              <Button className="md:px-8">{banner.out_url_text || "Go"}</Button>
            )}
          </div>
        )}
      </div>

      <div
        className="self-stretch flex flex-row items-center justify-center z-20 "
        onClick={handleNext}
      >
        <WhiteArrow
          width={54}
          onClick={handleNext}
          className="hover:cursor-pointer w-[32px] md:w-[54px]"
          style={{
            opacity: handleNext ? 1 : 0,
          }}
        />
      </div>
      {banner.image_url && (
        <Image
          src={banner.image_url}
          alt="Banner Image"
          fill={true}
          objectFit="cover"
          className="z-10"
        />
      )}
    </div>
  );
};

export default Banner;
