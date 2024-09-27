import { Chains } from "@/lib/types/enums";
import {
  BaseBadge,
  BNBBadge,
  CosmosBadge,
  EthBadge,
  MaticBadge,
  SolBadge,
  TonBadge,
  TronBadge,
} from "@repo/ui/badges";

type Options = {
  chain: Chains;
};

export default function ChainBadge({ chain }: Options) {
  switch (chain) {
    case "SOL":
      return <SolBadge />;
    case "TRON":
      return <TronBadge />;
    case "BASE":
      return <BaseBadge />;
    case "BNB":
      return <BNBBadge />;
    case "COSMOS":
      return <CosmosBadge />;
    case "ETH":
      return <EthBadge />;
    case "MATIC":
      return <MaticBadge />;
    case "TON":
      return <TonBadge />;
    default:
      return null;
  }
}
