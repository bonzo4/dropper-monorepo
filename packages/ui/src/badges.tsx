import base from "../public/badges/badge base.png";
import bnb from "../public/badges/badge bnb.png";
import cosmos from "../public/badges/badge cosmos.png";
import cto from "../public/badges/badge CTO.png";
import gold from "../public/badges/badge gold.png";
import matic from "../public/badges/badge matic.png";
import moon from "../public/badges/badge moon.png";
import degenPumpFun from "../public/badges/badge degen pump fun.png";
import sol from "../public/badges/badge sol.png";
import trending from "../public/badges/badge trending.png";
import degenFund from "../public/badges/badge degen fund.png";
import eth from "../public/badges/badge eth.png";
import game from "../public/badges/badge game.png";
import gaspump from "../public/badges/badge gaspump.png";
import holder1k from "../public/badges/badge holder 1k.png";
import holder5k from "../public/badges/badge holder 5k.png";
import holder10k from "../public/badges/badge holder 10k.png";
import holder20k from "../public/badges/badge holder 20k.png";
import lmao from "../public/badges/badge lmao.png";
import mcap1m from "../public/badges/badge mcap 1m.png";
import mcap5m from "../public/badges/badge mcap 5m.png";
import mcap10m from "../public/badges/badge mcap 10m.png";
import mcap25m from "../public/badges/badge mcap 25m.png";
import mcap25k from "../public/badges/badge mcap 25k.png";
import mcap50k from "../public/badges/badge mcap 50k.png";
import mcap50m from "../public/badges/badge mcap 50m.png";
import mcap75m from "../public/badges/badge mcap 75m.png";
import mcap100k from "../public/badges/badge mcap 100k.png";
import mcap100m from "../public/badges/badge mcap 100m.png";
import mcap500k from "../public/badges/badge mcap 500k.png";
import mcap750k from "../public/badges/badge mcap 750k.png";
import mcap250k from "../public/badges/badge mcap 250k.png";
import moonshot from "../public/badges/badge moonshot.png";
import ntwrkPartner from "../public/badges/badge ntwrk partner.png";
import pinksale from "../public/badges/badge pinksale.png";
import pumpFun from "../public/badges/badge pump fun.png";
import sunpump from "../public/badges/badge sunpump.png";
import ton from "../public/badges/badge ton.png";
import tron from "../public/badges/badge tron.png";
import volume1m from "../public/badges/badge volume 1m.png";
import volume2point5m from "../public/badges/badge volume 2.5m.png";
import volume5m from "../public/badges/badge volume 5m.png";
import volume10m from "../public/badges/badge volume 10m.png";
import volume20m from "../public/badges/badge volume 20m.png";
import volume100k from "../public/badges/badge volume 100k.png";
import volume250k from "../public/badges/badge volume 250k.png";
import volume500k from "../public/badges/badge volume 500k.png";
import volume750k from "../public/badges/badge volume 750k.png";
import { ImageProps } from "next/image";
import Image from "next/image";

type BadgeProps = {} & Omit<ImageProps, "src" | "alt">;

export const DegenPumpFunBadge = ({ ...props }: BadgeProps) => (
  <Image
    width={21}
    height={21}
    {...props}
    src={degenPumpFun}
    alt="Degen Pump Fun"
  />
);

export const DegenFundBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={degenFund} alt="Degen Fund" />
);

export const EthBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={eth} alt="Eth" />
);

export const GameBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={game} alt="Game" />
);

export const GaspumpBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={gaspump} alt="Gaspump" />
);

export const Holder5kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={holder5k} alt="Holder 5k" />
);

export const Holder1kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={holder1k} alt="Holder 1k" />
);

export const Holder10kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={holder10k} alt="Holder 10k" />
);

export const Holder20kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={holder20k} alt="Holder 20k" />
);

export const LmaoBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={lmao} alt="Lmao" />
);

export const Mcap1mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap1m} alt="Mcap 1m" />
);

export const Mcap5mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap5m} alt="Mcap 5m" />
);

export const Mcap10mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap10m} alt="Mcap 10m" />
);

export const Mcap25mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap25m} alt="Mcap 25m" />
);

export const Mcap25kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap25k} alt="Mcap 25k" />
);

export const Mcap50kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap50k} alt="Mcap 50k" />
);

export const Mcap50mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap50m} alt="Mcap 50m" />
);

export const Mcap75mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap75m} alt="Mcap 75m" />
);

export const Mcap100kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap100k} alt="Mcap 100k" />
);

export const Mcap100mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap100m} alt="Mcap 100m" />
);

export const Mcap250kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap250k} alt="Mcap 250k" />
);

export const Mcap500kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap500k} alt="Mcap 500k" />
);

export const Mcap750kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={mcap750k} alt="Mcap 750k" />
);

export const MoonshotBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={moonshot} alt="Moonshot" />
);

export const NtwrkPartnerBadge = ({ ...props }: BadgeProps) => (
  <Image
    width={21}
    height={21}
    {...props}
    src={ntwrkPartner}
    alt="Ntwrk Partner"
  />
);

export const PinksaleBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={pinksale} alt="Pinksale" />
);

export const SunpumpBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={sunpump} alt="Sunpump" />
);

export const TonBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={ton} alt="Ton" />
);

export const TronBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={tron} alt="Tron" />
);

export const Volume1mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume1m} alt="Volume 1m" />
);

export const Volume2point5mBadge = ({ ...props }: BadgeProps) => (
  <Image
    width={21}
    height={21}
    {...props}
    src={volume2point5m}
    alt="Volume 2.5m"
  />
);

export const Volume5mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume5m} alt="Volume 5m" />
);

export const Volume10mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume10m} alt="Volume 10m" />
);

export const Volume20mBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume20m} alt="Volume 20m" />
);

export const Volume100kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume100k} alt="Volume 100k" />
);

export const Volume250kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume250k} alt="Volume 250k" />
);

export const Volume500kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume500k} alt="Volume 500k" />
);

export const Volume750kBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={volume750k} alt="Volume 750k" />
);

export const BaseBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={base} alt="Base" />
);

export const BNBBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={bnb} alt="BNB" />
);

export const CosmosBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={cosmos} alt="Cosmos" />
);

export const CTOBadge = ({ ...props }: BadgeProps) => (
  <Image width={21} height={21} {...props} src={cto} alt="CTO" />
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
