import base from "@/public/badges/base.png";
import bnb from "@/public/badges/bnb.png";
import cto from "@/public/badges/CTO.png";
import fist from "@/public/badges/fist.png";
import gold from "@/public/badges/gold.png";
import matic from "@/public/badges/matic.png";
import moon from "@/public/badges/moon.png";
import pumpFun from "@/public/badges/pump fun.png";
import sol from "@/public/badges/sol.png";
import trending from "@/public/badges/trending.png";
import { ImageProps } from "next/image";
import Image from "next/image";

type BadgeProps = {} & Omit<ImageProps, "src" | "alt">;

export const BaseBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={base} alt="Base" />
);

export const BNBBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={bnb} alt="BNB" />
);

export const CTOBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={cto} alt="CTO" />
);

export const FistBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={fist} alt="Fist" />
);

export const GoldBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={gold} alt="Gold" />
);

export const MaticBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={matic} alt="Matic" />
);

export const MoonBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={moon} alt="Moon" />
);

export const PumpFunBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={pumpFun} alt="Pump Fun" />
);

export const SolBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={sol} alt="Sol" />
);

export const TrendingBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={trending} alt="Trending" />
);
