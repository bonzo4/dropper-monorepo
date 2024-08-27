import { AirdropRow } from "@/lib/types/airdrop";
import { Discord, Docs, Telegram, Twitter, Web } from "@/components/icons";
import Image from "next/image";

type AirdropInfoProps = {
  airdrop: AirdropRow;
} & React.HTMLAttributes<HTMLDivElement>;

const AirdropInfo = ({ airdrop, ...props }: AirdropInfoProps) => {
  return (
    <div
      {...props}
      className="w-full relative overflow-hidden flex flex-row items-center pl-4 md:pl-0 md:justify-start gap-[20px] text-[24px] md:text-[37px] text-text font-fff-forward b"
    >
      <Image
        src={airdrop.icon_url}
        alt={airdrop.title}
        width={119}
        height={119}
        className="rounded-md"
      />
      <div className="self-stretch overflow-hidden flex flex-col items-start justify-center p-2.5 gap-[12px]">
        <div className="flex flex-row items-center justify-start">
          <div className="relative">
            {airdrop.title} (${airdrop.symbol})
          </div>
        </div>
        {(airdrop.site_url ||
          airdrop.twitter_url ||
          airdrop.discord_url ||
          airdrop.telegram_url ||
          airdrop.docs_url) && (
          <div className="overflow-hidden flex flex-row items-center justify-start gap-[16px]">
            {airdrop.site_url && <Web width={20} />}
            {airdrop.twitter_url && <Twitter width={20} />}
            {airdrop.discord_url && <Discord width={20} />}
            {airdrop.telegram_url && <Telegram width={20} />}
            {airdrop.docs_url && <Docs width={20} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default AirdropInfo;
