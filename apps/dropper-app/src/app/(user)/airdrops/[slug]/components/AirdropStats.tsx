import { AirdropPageRow } from "@repo/types/airdrop";
import { Arrow } from "@repo/ui/Icons";
import { numString } from "@/lib/utils/numString";

type AirdropStatsProps = {
  airdrop: AirdropPageRow;
} & React.HTMLAttributes<HTMLDivElement>;

const AirdropStats = ({ airdrop, ...props }: AirdropStatsProps) => {
  return (
    <div className="w-full flex flex-wrap items-center justify-center md:justify-between text-[10px] gap-10">
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Questers</span>
        <span className="text-primary">{airdrop.questers}</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Difficulty</span>
        <span className="text-primary">{airdrop.difficulty}</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Sentiment</span>
        <div className="flex flex-row items-center justify-between w-full">
          <Arrow width={10} className="rotate-90" />
          <span className="text-primary">{airdrop.sentiment}%</span>
          <Arrow width={10} className="-rotate-90" />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Likelihood</span>
        <span className="text-primary">{airdrop.likelihood}%</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Category</span>
        <span className="text-primary">{airdrop.category}</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Blockchain</span>
        <span className="text-primary">{airdrop.blockchain}</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-white ">Est. Airdrop</span>
        <span className="text-primary">
          {numString(airdrop.est_airdrop_size)} ${airdrop.symbol}
        </span>
      </div>
    </div>
  );
};

export default AirdropStats;
