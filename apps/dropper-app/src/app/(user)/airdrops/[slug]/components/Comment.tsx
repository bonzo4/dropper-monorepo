import Button from "@/components/ui/Button";
import { Database } from "@/lib/supabase/types";
import { DropmanView } from "@/lib/types/user";
// import { AirdropCommentRow } from "@/lib/types/comment";
import { cn } from "@/lib/utils/classNames";
import { Arrow } from "@/components/icons";
import Image from "next/image";

type CommentProps = {
  comment: Database["public"]["Tables"]["airdrop_comments"]["Row"] & {
    user?: DropmanView;
  };
} & React.HTMLAttributes<HTMLDivElement>;

const Comment = ({ comment, ...props }: CommentProps) => {
  return (
    <div
      {...props}
      className="relative w-full overflow-hidden flex flex-col items-start justify-start p-2.5 box-border gap-[15px] text-left text-[14px] text-text font-fff-forward"
    >
      <div className=" overflow-hidden flex flex-row items-center justify-start py-[5px] gap-[10px]">
        {comment.user?.icon && (
          <Image
            src={comment.user?.icon}
            alt="user icon"
            width={48}
            height={48}
            className="rounded-[50%]"
          />
        )}
        <span className="relative">{comment.user?.username}</span>
      </div>
      <div className="overflow-hidden flex flex-row items-start justify-start  font-made-outer-sans">
        <p className={cn("w-full relative inline-block shrink-0 text-[12px]")}>
          {comment.comment}
        </p>
      </div>
      <div className=" overflow-hidden flex flex-row items-center justify-center gap-[15px]">
        <Button className="rounded-lg bg-secondary flex flex-row items-center justify-center py-2 px-3 gap-[16px] border-[1px] border-solid border-primary">
          <Arrow width={16} className="rotate-90" />
          <span className="relative text-xs">{comment.down_votes}</span>
        </Button>
        <Button className="rounded-lg bg-secondary flex flex-row items-center justify-center py-2 px-3 gap-[16px] border-[1px] border-solid border-primary">
          <Arrow width={16} className="-rotate-90" />
          <span className="relative text-xs">{comment.up_votes}</span>
        </Button>
      </div>
    </div>
  );
};

export default Comment;
