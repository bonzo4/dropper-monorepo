import { Paragraph } from "@repo/ui/Paragraph";
import { AirdropPreviewItem } from "@repo/types/airdrop";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";

type AirdropCardProps = {
  airdrop: AirdropPreviewItem;
} & React.HTMLAttributes<HTMLDivElement>;

const AirdropCard = ({ airdrop, ...props }: AirdropCardProps) => {
  return (
    <Link href={`/drops/${airdrop.slug}`}>
      <div className="rounded-md bg-secondary flex flex-row items-center justify-start border-[2px] border-primary hover:cursor-pointer hover:bg-white hover:bg-opacity-25  px-4 md:px-4 py-3 gap-[12px]">
        <Image
          src={airdrop.icon_url}
          alt={airdrop.title}
          width={170}
          height={170}
          className="w-[100px] md:w-[170px] relative rounded-md h-[100px] md:h-[170px]"
        />
        <div className="flex flex-col justify-between md:py-2 w-full">
          <Paragraph className="text-[14px]">Entries: 2430</Paragraph>
          <h3 className="relative text-[20px] md:text-[22px]">
            {airdrop.title} (${airdrop.symbol})
          </h3>
          <Paragraph className="w-[180px] md:w-[300px] max-h-[40px] h-min text-[12px] md:text-[14px] mb-[6px]">
            {airdrop.description}
          </Paragraph>
          <div className="self-stretch flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col items-start justify-center">
              <span className="relative text-[9px] md:text-[14px] tracking-widest">
                Questers
              </span>
              <Paragraph className="relative text-[10px] md:text-[14px] text-primary font-semibold">
                245
              </Paragraph>
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="relative text-[9px] md:text-[14px] tracking-widest">
                Blockchain
              </span>
              <Paragraph className="relative text-[10px] md:text-[14px] text-primary font-semibold">
                {airdrop.blockchain}
              </Paragraph>
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="flex flex-row gap-1 relative text-[9px] md:text-[14px] tracking-widest">
                <span className="hidden md:flex">Est.</span> Airdrop
              </span>
              <Paragraph className="relative text-[10px] md:text-[14px] text-primary font-semibold">
                {numString(airdrop.est_airdrop_size)} ${airdrop.symbol}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AirdropCard;
