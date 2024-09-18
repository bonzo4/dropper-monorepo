"use client";
import { Arrow } from "@repo/ui/icons";
import { useState } from "react";

type TabProps = {
  label: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Tab = ({ label, ...props }: TabProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full relative flex flex-col items-center justify-start gap-[40px] text-left text-xl text-text font-fff-forward md:px-0 px-4">
      <div
        className="flex-1 w-full relative rounded-md bg-secondary box-border overflow-hidden shrink-0 flex flex-row items-center justify-start py-4 px-5 gap-[28px] max-w-[737px] text-left  text-primary font-fff-forward border-[2px] border-solid border-primary hover:cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      >
        <h2 className="relative text-[20px]">{label}</h2>
        {show ? (
          <Arrow width={18} className="rotate-90" />
        ) : (
          <Arrow width={18} />
        )}
      </div>
      {show && (
        <div className="flex w-full">
          <div {...props} />
        </div>
      )}
    </div>
  );
};
