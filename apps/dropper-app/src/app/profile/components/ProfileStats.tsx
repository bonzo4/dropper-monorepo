import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";

export default function ProfileStats() {
  return (
    <div className="w-full flex lg:flex-row flex-wrap items-center lg:justify-between justify-center md:justify-between text-[14px] lg:gap-0 gap-8 px-2">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span>Missions</span>
          <span>Started</span>
        </div>

        <span className={cn(mono.className, "text-primary")}>XXXX</span>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span>Missions</span>
          <span>Completed</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>XXXX</span>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span>Airdrops</span>
          <span>Claimed</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>XXXX</span>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span>Dropman</span>
          <span>XP?</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>XXXX</span>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span>Drops Won</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>XXXX</span>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col">
          <span>Drops</span>
          <span>Created</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>XXXX</span>
      </div>
    </div>
  );
}
