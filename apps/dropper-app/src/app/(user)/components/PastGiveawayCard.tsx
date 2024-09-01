"use client";
import { Paragraph } from "@/components/ui/Paragraph";
import { AirdropPreviewItem } from "@/lib/types/airdrop";
import { numString } from "@/lib/utils/numString";
import Image from "next/image";
import Link from "next/link";
import { LandingGiveaway } from "../../api/giveaways/route";
import {
  BaseBadge,
  BNBBadge,
  CTOBadge,
  FistBadge,
  GoldBadge,
  MaticBadge,
  MoonBadge,
  PumpFunBadge,
  SolBadge,
  TrendingBadge,
} from "@/lib/utils/badges";

type PastGiveawayCardProps = {
  giveaway: LandingGiveaway;
  solValue: number;
} & React.HTMLAttributes<HTMLDivElement>;

const PastGiveawayCard = ({
  giveaway,
  solValue,
  ...props
}: PastGiveawayCardProps) => {
  const endDate = new Date(giveaway.end_time);

  return (
    <Link href={`/drops/${giveaway.id}`}>
      <div className="flex flex-col bg-secondary border-[2px] rounded-md border-white hover:cursor-pointer hover:bg-black p-4 gap-3">
        <div className="flex flex-row items-stretch gap-[10px]">
          <Image
            src={giveaway.icon_url}
            alt={giveaway.title}
            width={63}
            height={63}
            className="w-[63px] md:w-[63px] relative rounded-md h-[63px] md:h-[63px]"
          />
          <div className="flex flex-col ">
            <div className="flex flex-row gap-1">
              {giveaway.badges.map((badge) =>
                badge === "BASE" ? (
                  <BaseBadge key={badge} />
                ) : badge === "BNB" ? (
                  <BNBBadge key={badge} />
                ) : badge === "GOLD" ? (
                  <GoldBadge key={badge} />
                ) : badge === "FIST" ? (
                  <FistBadge key={badge} />
                ) : badge === "MATIC" ? (
                  <MaticBadge key={badge} />
                ) : badge === "MOON" ? (
                  <MoonBadge key={badge} />
                ) : badge === "PUMP_FUN" ? (
                  <PumpFunBadge key={badge} />
                ) : badge === "SOL" ? (
                  <SolBadge key={badge} />
                ) : badge === "TRENDING" ? (
                  <TrendingBadge key={badge} />
                ) : badge === "CTO" ? (
                  <CTOBadge key={badge} />
                ) : (
                  <div
                    key={badge}
                    className="h-[21px] w-[21px] bg-placeholder rounded-full"
                  />
                )
              )}
            </div>
            <h3 className="relative text-[20px] md:text-[32px] truncate w-[160px]">
              ${giveaway.ticker}
            </h3>
          </div>
        </div>
        <Paragraph className="w-[221px] h-[80px] text-[14px]">
          {giveaway.title} : {giveaway.description}
        </Paragraph>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col items-start justify-center">
            <span className="relative text-[9px] md:text-[14px] tracking-widest">
              Reward
            </span>
            <Paragraph className="relative text-[10px] md:text-[16px] text-white opacity-25 font-semibold">
              {numString(giveaway.reward_amount)} $
              {giveaway.token_address ? `$${giveaway.ticker}` : "SOL"}
            </Paragraph>
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="relative text-[14px] tracking-widest">
              USDC VAL. 🔥
            </span>
            <Paragraph className="relative text-[16px] text-white opacity-25 font-semibold">
              $
              {giveaway.token_address
                ? giveaway.usd_value.toFixed(2)
                : (solValue * giveaway.reward_amount).toFixed(2)}
            </Paragraph>
          </div>
        </div>
        <Paragraph className="text-[14px]">
          Entries: {giveaway.entries}
        </Paragraph>
        <div className="flex flex-row items-center justify-between p-[7px] border-[2px] border-red rounded-md">
          <span className="flex flex-row gap-1 relative text-[14px] tracking-widest">
            DROP ENDED ON
          </span>
          <Paragraph className="text-[16px] font-semibold text-white opacity-25">
            {endDate.getMonth() + 1}/{endDate.getDate()}/
            {endDate.getFullYear().toString().slice(-2)}
          </Paragraph>
        </div>
      </div>
    </Link>
  );
};

export default PastGiveawayCard;
