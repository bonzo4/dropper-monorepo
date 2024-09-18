import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";

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
