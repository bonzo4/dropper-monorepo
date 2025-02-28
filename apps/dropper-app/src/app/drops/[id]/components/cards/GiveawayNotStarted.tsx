import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { Notification, Confetti, Hourglass } from "@repo/ui/icons";
import Countdown from "react-countdown";
import { Button } from "@repo/ui";
import { GiveawayEntryRow } from "@/lib/types/giveaway";

type GiveawayNotStartedOptions = {
  startDate: Date;
};

export default function GiveawayNotStarted({
  startDate,
}: GiveawayNotStartedOptions) {
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    const dayHours = days * 24;
    hours = hours + dayHours;
    if (completed) {
      // Render a completed state
      return (
        <span className={cn(mono.className, "text-primary font-semibold")}>
          00:00:00
        </span>
      );
    } else {
      return (
        <span
          className={cn(mono.className, "text-primary font-semibold")}
          suppressHydrationWarning={true}
          style={{
            color:
              hours === 0 && minutes <= 9
                ? "#ff2e2f"
                : hours === 0 && minutes <= 29
                  ? "#ff822e"
                  : hours === 0 && minutes <= 49
                    ? "#ffcb2e"
                    : undefined,
          }}
        >
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-yellow rounded-md p-4 gap-5">
      <Hourglass width={80} height={74} />
      <span className="text-xl">PLEASE WAIT...</span>
      <span className="text-base text-yellow">
        {"THIS DROP HASN'T STARTED YET"}
      </span>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 border-2 border-yellow rounded-md p-2">
        <span className="text-sm">TIME LEFT UNTIL START</span>
        <Countdown date={startDate} renderer={renderer} />
      </div>
    </div>
  );
}
