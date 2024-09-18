import {
  Holder20kBadge,
  Holder10kBadge,
  Holder1kBadge,
  Holder5kBadge,
} from "@repo/ui/badges";

type Props = {
  holders: number;
};

export default function HolderBadge({ holders }: Props) {
  if (holders >= 20_000) {
    return <Holder20kBadge />;
  }

  if (holders >= 10_000) {
    return <Holder10kBadge />;
  }

  if (holders >= 5_000) {
    return <Holder5kBadge />;
  }

  if (holders >= 1_000) {
    return <Holder1kBadge />;
  }

  return null;
}
