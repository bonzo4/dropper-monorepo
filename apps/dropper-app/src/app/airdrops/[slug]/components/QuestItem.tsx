import { QuestItemRow } from "@/lib/types/sections";

type QuestItemProps = {
  item: QuestItemRow;
} & React.HTMLAttributes<HTMLDivElement>;

const QuestItem = ({ item, ...props }: QuestItemProps) => {
  return (
    <div className="overflow-hidden flex flex-row items-center justify-start p-2.5 gap-[10px]">
      <div className="w-7 relative bg-secondary box-border h-7 overflow-hidden shrink-0 border-[2px] border-solid border-primary" />
      <span className="flex-1 relative">{item.name}</span>
    </div>
  );
};

export default QuestItem;
