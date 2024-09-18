"use client";
import { Arrow } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import { SetStateAction, useState } from "react";

type GiveawayTabProps = {
  label: string;
  link: string;
  setCompletedCount: (args_0: SetStateAction<number>) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const GiveawayTab = ({
  label,
  link,
  setCompletedCount,
  ...props
}: GiveawayTabProps) => {
  const [done, setDone] = useState(false);

  const handleComplete = () => {
    setDone(true);
    setCompletedCount((prev) => prev + 1);
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-start gap-[40px] text-left text-xl text-text font-fff-forward md:px-0 px-4">
      {!done ? (
        <div className="flex-1 w-full relative rounded-md bg-secondary box-border overflow-hidden shrink-0 flex flex-row items-center justify-between py-4 px-5 gap-[28px] max-w-[737px] text-left  text-primary font-fff-forward border-[2px] border-solid border-primary  ">
          <h2 className="text-[20px]">{label}</h2>
          {done ? (
            <span>Done</span>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Button
                className="py-0 z-20 hover:bg-black"
                onClick={handleComplete}
              >
                Go
              </Button>
            </a>
          )}
        </div>
      ) : (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 w-full relative rounded-md bg-secondary box-border overflow-hidden shrink-0 flex flex-row items-center justify-between py-4 px-5 gap-[28px] max-w-[737px] text-left  text-primary font-fff-forward border-[2px] border-solid border-primary hover:cursor-pointer z-10 hover:bg-black"
        >
          <h2 className="text-[20px]">{label}</h2>
          <span>Done</span>
        </a>
      )}
    </div>
  );
};

export default GiveawayTab;
