import { CommunityPostRow, CommunitySectionRow } from "@/lib/types/sections";
import CommunityPost from "./CommunityPost";

type CommunitySectionProps = {
  section: CommunitySectionRow & {
    community_posts: CommunityPostRow[];
  };
} & React.HTMLAttributes<HTMLDivElement>;

const CommunitySection = ({ section, ...props }: CommunitySectionProps) => {
  return (
    <div
      {...props}
      className="w-full relative overflow-hidden flex flex-col items-start justify-center py-0 px-5 box-border gap-[20px] font-fff-forward text-xl"
    >
      {section.community_posts.map((post) => (
        <CommunityPost post={post} key={post.order} />
      ))}
    </div>
  );
};

export default CommunitySection;
