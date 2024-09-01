import { AirdropPreviewItem } from "@repo/types/airdrop";
import AirdropCard from "./AirdropCard";

type AirdropsOptions = {
  airdrops: AirdropPreviewItem[];
} & React.HTMLAttributes<HTMLDivElement>;

const Airdrops = ({ airdrops, ...props }: AirdropsOptions) => {
  return (
    <div
      {...props}
      className="relative flex flex-col md:flex-row md:flex-wrap justify-center items-center text-text font-fff-forward grow  gap-8 lg:space-y-0 pb-4"
    >
      {airdrops.map((airdrop) => (
        <AirdropCard key={airdrop.id} airdrop={airdrop} />
      ))}
    </div>
  );
};

export default Airdrops;
