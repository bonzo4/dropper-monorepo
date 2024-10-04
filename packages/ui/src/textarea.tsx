import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import type { NextPage } from "next";

type TextAreaProps = {} & React.HTMLProps<HTMLTextAreaElement>;

export const Textarea = (props: TextAreaProps) => {
  return (
    <div className={cn(mono.className, "flex w-full")}>
      <textarea
        {...props}
        className={cn(
          mono.className,
          "relative shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-xl bg-secondary box-border flex flex-row items-start justify-start py-1 px-4 min-w-[256px] text-left text-[12px] text-text font-fff-forward rounded-md w-full",
          props.className
        )}
      />
    </div>
  );
};
