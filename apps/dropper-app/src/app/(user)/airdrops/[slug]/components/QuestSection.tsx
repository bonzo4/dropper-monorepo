import { QuestItemRow, QuestRow, QuestSectionRow } from "@repo/types/airdrop";
import Quest from "./Quest";

type QuestsSectionsProps = {
  section: QuestSectionRow & {
    quests: (QuestRow & { quest_items: QuestItemRow[] })[];
  };
} & React.HTMLAttributes<HTMLDivElement>;

const QuestsSections = ({ section, ...props }: QuestsSectionsProps) => {
  return (
    <div
      {...props}
      className="w-full relative overflow-hidden flex flex-col items-start justify-center py-0 px-5 box-border gap-[20px] font-fff-forward text-xl"
    >
      <h2 className="relative text-left  text-primary ">Quests</h2>
      <div className="self-stretch flex flex-col items-start justify-center py-0 px-9 gap-[32px] text-text">
        {section.quests
          .sort((a, b) => a.order - b.order)
          .map((quest) => (
            <Quest key={quest.id} quest={quest} />
          ))}
      </div>
    </div>
  );
};

export default QuestsSections;
