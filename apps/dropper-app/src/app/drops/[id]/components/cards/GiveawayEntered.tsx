import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { QuestionCoin } from "@repo/ui/icons";
import Countdown from "react-countdown";

type GiveawayEnteredOptions = {
  endDate: Date;
};

export default function GiveawayEntered({ endDate }: GiveawayEnteredOptions) {
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
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-primary rounded-md p-8 gap-5">
      <QuestionCoin width={80} height={74} />
      <span className="text-xl">YOU COULD WIN!</span>
      <span className="text-base text-primary">YOU ARE ENTERED!</span>
      <div className="flex flex-row items-center gap-6 border-2 border-primary rounded-md p-2">
        <span className="text-sm">WINNERS REVEALED IN</span>
        <Countdown date={endDate.getTime()} renderer={renderer} />
      </div>
    </div>
  );
}
