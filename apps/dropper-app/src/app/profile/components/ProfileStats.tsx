import { GiveawayStats, ListingStats, UserPoints } from "@/lib/types/stats";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";

type Options = {
  userPoints: UserPoints | null;
  giveawayStats: GiveawayStats | null;
  listingStats: ListingStats | null;
};

export default function ProfileStats({
  userPoints,
  giveawayStats,
  listingStats,
}: Options) {
  return (
    <div className="w-full flex lg:flex-row flex-wrap justify-center sm:justify-between text-[14px] lg:gap-0 gap-8 px-8">
      <div className="flex flex-col gap-2 w-[80px]">
        <div className="flex flex-col">
          <span>Referral</span>
          <span>Points</span>
        </div>

        <span className={cn(mono.className, "text-primary")}>
          {userPoints ? userPoints.referral_points : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Activity</span>
          <span>Points</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {userPoints ? userPoints.activity_points : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Giveaways</span>
          <span>Created</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {giveawayStats ? giveawayStats.giveaways_created : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Giveaways</span>
          <span>Entered</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {giveawayStats ? giveawayStats.giveaways_entered : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Listings</span>
          <span>Created</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {listingStats ? listingStats.listings_created : 0}
        </span>
      </div>
      <div className="flex flex-col gap-2  w-[80px]">
        <div className="flex flex-col">
          <span>Listings</span>
          <span>Bumped</span>
        </div>
        <span className={cn(mono.className, "text-primary")}>
          {listingStats ? listingStats.listing_bumps : 0}
        </span>
      </div>
    </div>
  );
}
