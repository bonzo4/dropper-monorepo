"use client";
import Button from "@/components/ui/Button";
import { Arrow, WhiteArrow } from "@/components/icons";
import { useState } from "react";
import QuestItem from "./QuestItem";
import { QuestItemRow, QuestRow } from "@/lib/types/sections";

type QuestProps = {
  quest: QuestRow & { airdrop_quest_items: QuestItemRow[] };
} & React.HTMLAttributes<HTMLDivElement>;

const Quest = ({ quest, ...props }: QuestProps) => {
  const [show, setShow] = useState(false);
  return (
    <div
      {...props}
      className="self-stretch flex flex-col items-start justify-center gap-[8px] text-primary"
    >
      <div
        className="flex flex-row items-center justify-start gap-[16px]"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? (
          <Arrow width={18} className="rotate-90" />
        ) : (
          <WhiteArrow width={18} />
        )}
        <div className="flex flex-row items-center justify-start">
          <div
            className="relative"
            style={{
              color: !show ? "#fff" : undefined,
            }}
          >
            {quest.title}
          </div>
        </div>
      </div>
      {show && (
        <div className="w-full flex flex-col items-start justify-center py-0 px-10 gap-[10px] text-sm text-text font-made-outer-sans">
          {quest.airdrop_quest_items
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <QuestItem key={item.id} item={item} />
            ))}
          <div className="w-full self-stretch flex flex-row items-center justify-center gap-[10px] text-[12px] ">
            <span className="relative text-[12px]">
              Rewards: {quest.exp_reward}xp
            </span>
            <Button>Complete</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quest;
