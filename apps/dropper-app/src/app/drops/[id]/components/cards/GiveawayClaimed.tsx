import { Notification, Confetti } from "@/components/icons";

export default function GiveawayClaimed() {
  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-primary rounded-md p-4 gap-5">
      <div className="absolute top-1 right-2">
        <Notification width={26} height={20} />
      </div>
      <Confetti width={80} height={74} />
      <span className="text-xl">CONGRATULATIONS</span>
      <span className="text-base text-primary">YOW WON THE DROP</span>
      <div className="flex flex-row items-center gap-6 border-2 border-primary rounded-md p-2">
        Claimed
      </div>
    </div>
  );
}
