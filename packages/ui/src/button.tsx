import { cn } from "@repo/ui/utils";

type ButtonProps = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  if (props.disabled)
    return (
      <button
        {...props}
        disabled
        className={cn(
          "relative rounded-lg bg-secondary box-border flex flex-row items-center justify-center py-1 px-3 text-left text-[12px] md:text-[14px] text-primary font-fff-forward border-[2px] border-solid border-primary opacity-25",
          props.className
        )}
      >
        {props.children}
      </button>
    );

  return (
    <button
      {...props}
      className={cn(
        "relative rounded-lg bg-secondary box-border flex flex-row items-center justify-center py-1 px-3 text-left text-[12px] md:text-[14px] text-primary font-fff-forward border-[2px] border-solid border-primary hover:bg-white hover:bg-opacity-25 ",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
