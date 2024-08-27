import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";

type ParagraphProps = {} & React.HTMLProps<HTMLParagraphElement>;

export const Paragraph: React.FC<ParagraphProps> = (props) => {
  return (
    <p
      {...props}
      className={cn(
        mono.className,
        "flex relative whitespace-pre-wrap text-[14px] truncate",
        props.className
      )}
    >
      {props.children}
    </p>
  );
};
