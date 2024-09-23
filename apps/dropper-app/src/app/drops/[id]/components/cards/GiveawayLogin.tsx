import { Notification, Confetti, Hold } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import Link from "next/link";
import Countdown from "react-countdown";

type GiveawayLoginProps = {
  endDate: Date;
};

export default function GiveawayLogin({ endDate }: GiveawayLoginProps) {
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
    <div className="relative flex flex-col items-center w-[300px] md:w-[570px] border-2 border-orange rounded-md p-4 gap-5">
      <Hold width={80} height={74} />
      <span className="text-xl">HOLD UP...</span>
      <span className="text-base text-orange">
        PLEASE LOGIN TO {endDate > new Date() ? "ENTER" : "CHECK"}
      </span>
      {endDate < new Date() && (
        <Button className="border-orange text-orange">LOGIN</Button>
      )}
      {endDate > new Date() && (
        <div className="flex flex-row items-center gap-6 border-2 border-orange rounded-md p-2">
          <span className="text-sm">TIME LEFT TO ENTER</span>
          <Countdown date={endDate} renderer={renderer} />
          <Link href="/login">
            <Button className="border-orange text-orange">LOGIN</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
