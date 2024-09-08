import { AirdropPreviewItem } from "@/lib/types/airdrop";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";

type AirdropListItemProps = {
  airdrop: AirdropPreviewItem;
  index: number;
} & React.HTMLAttributes<HTMLDivElement>;

const AirdropListItem = ({
  airdrop,
  index,
  ...props
}: AirdropListItemProps) => {
  return (
    <Link href={`/drops/${airdrop.slug}`}>
      <div
        {...props}
        className="w-full overflow-hidden flex flex-row items-center py-2.5 px-2 md:pr-5 lg:pl-10 hover:bg-secondary hover:bg-opacity-50 rounded-md border-[2px] border-transparent gap-[4px] hover:cursor-pointer"
      >
        <div className="w-[110px] md:w-[150px] lg:w-[220px] overflow-hidden  flex flex-row items-center justify-start gap-[8px] ">
          <span className="relative">{index + 1}.</span>
          <Image
            src={airdrop.icon_url}
            alt={airdrop.title}
            width={24}
            height={24}
            className="w-[16px] h-[16px] md:w-[24px] relative rounded-[3px] bg-placeholder md:h-[24px] overflow-hidden shrink-0"
          />
          <span className="relative ">
            {airdrop.title} (${airdrop.symbol})
          </span>
        </div>
        <div className="w-[68px] md:w-[90px] lg:w-[110px] flex flex-row items-center justify-start pl-1">
          <span className="relative">
            {numString(airdrop.est_airdrop_size)}
          </span>
        </div>
        <div className="w-[68px] md:w-[90px] lg:w-[110px] flex flex-row items-center justify-start pl-1">
          <span className="relative">{airdrop.likelihood}%</span>
        </div>
        <div className="w-[68px] md:w-[90px] lg:w-[110px] md:flex hidden flex-row items-center justify-start pl-1">
          <span className="relative">{airdrop.questers}</span>
        </div>
        <div className="w-[68px] md:w-[90px] lg:w-[110px] md:flex hidden flex-row items-center justify-start pl-1">
          <span className="relative">{airdrop.sentiment}%</span>
        </div>
        <div className="w-[68px] md:w-[90px] lg:w-[110px] md:flex hidden flex-row items-center justify-start">
          <div className="relative">{airdrop.category}</div>
        </div>
        <div className="w-[68px] md:w-[90px] lg:w-[110px]flex flex-row items-center justify-start">
          <span className="relative">{airdrop.blockchain}</span>
        </div>
      </div>
    </Link>
  );
};

export default AirdropListItem;
