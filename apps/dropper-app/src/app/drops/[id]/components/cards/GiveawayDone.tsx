import { Notification, Confetti, Eyes } from "@repo/ui/icons";

export default function GiveawayDone() {
  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-primary rounded-md p-4 gap-5">
      <Eyes width={80} height={74} />
      <span className="text-xl">PLEASE WAIT...</span>
      <span className="text-base text-primary">PICKING THE WINNERS NOW</span>
      <div className="flex flex-row items-center gap-6 border-2 border-primary rounded-md p-2 text-md">
        Tallying...
      </div>
    </div>
  );
}
