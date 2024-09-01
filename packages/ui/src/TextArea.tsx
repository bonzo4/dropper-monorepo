import { cn } from "./utils/classNames";
import { mono } from "./utils/fonts";

type TextAreaProps = {} & React.HTMLProps<HTMLTextAreaElement>;

const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      {...props}
      className={cn(
        mono.className,
        "relative shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-xl bg-secondary box-border  flex flex-row items-start justify-start py-1 px-4 min-w-[256px] text-left text-[12px] text-text font-fff-forward",
        props.className
      )}
    />
  );
};

export default TextArea;
