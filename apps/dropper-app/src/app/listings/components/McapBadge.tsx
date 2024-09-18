import {
  Mcap100kBadge,
  Mcap100mBadge,
  Mcap10mBadge,
  Mcap1mBadge,
  Mcap250kBadge,
  Mcap25kBadge,
  Mcap25mBadge,
  Mcap50kBadge,
  Mcap50mBadge,
  Mcap5mBadge,
  Mcap750kBadge,
  Mcap75mBadge,
} from "@repo/ui/badges";

type Props = {
  mcap: number;
};

export default function McapBadge({ mcap }: Props) {
  if (mcap >= 100_000_000) {
    return <Mcap100mBadge />;
  }

  if (mcap >= 75_000_000) {
    return <Mcap75mBadge />;
  }

  if (mcap >= 50_000_000) {
    return <Mcap50mBadge />;
  }

  if (mcap >= 25_000_000) {
    return <Mcap25mBadge />;
  }

  if (mcap >= 10_000_000) {
    return <Mcap10mBadge />;
  }

  if (mcap >= 5_000_000) {
    return <Mcap5mBadge />;
  }

  if (mcap >= 1_000_000) {
    return <Mcap1mBadge />;
  }

  if (mcap >= 750_000) {
    return <Mcap750kBadge />;
  }

  if (mcap >= 500_000) {
    return <Mcap1mBadge />;
  }

  if (mcap >= 250_000) {
    return <Mcap250kBadge />;
  }

  if (mcap >= 100_000) {
    return <Mcap100kBadge />;
  }

  if (mcap >= 50_000) {
    return <Mcap50kBadge />;
  }

  if (mcap >= 25_000) {
    return <Mcap25kBadge />;
  }

  return null;
}
