import {
  Volume100kBadge,
  Volume10mBadge,
  Volume1mBadge,
  Volume20mBadge,
  Volume250kBadge,
  Volume2point5mBadge,
  Volume500kBadge,
  Volume5mBadge,
  Volume750kBadge,
} from "@repo/ui/badges";

type Props = {
  volume: number;
};

export default function VolumeBadge({ volume }: Props) {
  if (volume >= 20_000_000) {
    return <Volume20mBadge />;
  }

  if (volume >= 10_000_000) {
    return <Volume10mBadge />;
  }

  if (volume >= 5_000_000) {
    return <Volume5mBadge />;
  }

  if (volume > 2_500_00) {
    return <Volume2point5mBadge />;
  }

  if (volume >= 1_000_000) {
    return <Volume1mBadge />;
  }

  if (volume >= 750_000) {
    return <Volume750kBadge />;
  }

  if (volume >= 500_000) {
    return <Volume500kBadge />;
  }

  if (volume >= 250_000) {
    return <Volume250kBadge />;
  }

  if (volume >= 100_000) {
    return <Volume100kBadge />;
  }

  return null;
}
