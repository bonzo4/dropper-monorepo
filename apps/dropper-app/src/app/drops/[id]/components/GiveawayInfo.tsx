import { GiveawayPageData } from "@/lib/data/giveaway/getGiveawayPage";
import Image from "next/image";

type GiveawayInfoProps = {
  giveaway: GiveawayPageData;
} & React.HTMLAttributes<HTMLDivElement>;

const GiveawayInfo = ({ giveaway, ...props }: GiveawayInfoProps) => {
  const extraEntries = giveaway.entries - giveaway.entryIcons.length;
  return (
    <div
      {...props}
      className="w-full relative overflow-hidden flex flex-row items-center pl-4 sm:pl-0 sm:justify-start gap-[20px] text-[24px] sm:text-[37px] text-text font-fff-forward b"
    >
      <Image
        src={giveaway.icon_url}
        alt={giveaway.title}
        width={119}
        height={119}
        className="rounded-sm"
      />
      <div className="self-stretch overflow-hidden flex flex-col items-start justify-start">
        <div className="flex flex-row items-center justify-start">
          <h1 className="relative text-[32px] sm:text-[50px]">
            {giveaway.title} (${giveaway.ticker})
          </h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center justify-start -space-x-3">
            {giveaway.entryIcons.map((icon, index) => (
              <Image
                className="border-[3px] border-black rounded-full h-[38px] w-[38px] sm:h-[57px] sm:w-[57px]"
                key={icon}
                src={icon}
                alt={"user icon"}
                width={57}
                height={57}
                style={{
                  zIndex: index,
                }}
              />
            ))}
          </div>
          {extraEntries > 0 && (
            <div className="flex items-center justify-center rounded-full h-[32px] w-[32px] sm:h-[51px] sm:w-[51px] bg-gradient-to-br from-[#A000D6] to-[#232323]">
              <span className="text-[12px]">+{extraEntries}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiveawayInfo;
