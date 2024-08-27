import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";

type InputProps = {} & React.HTMLProps<HTMLInputElement>;

const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      className={cn(
        "relative shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-full bg-secondary box-border  flex flex-row items-start justify-start py-1 px-4 min-w-[256px] text-left text-[12px] text-text font-fff-forward ",
        props.className,
        mono.className
      )}
      style={{
        opacity: props.disabled ? "50%" : "100%",
      }}
    />
  );
};

export default Input;
