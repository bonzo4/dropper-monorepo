import { ArrowWhite } from "@repo/ui/icons";
import Link from "next/link";

type Props = {
  prevListingId: number | null;
  nextListingId: number | null;
};

export default function ListingRouter({ prevListingId, nextListingId }: Props) {
  return (
    <div>
      {prevListingId ? (
        <Link
          href={`/listings/${prevListingId}`}
          className="absolute  flex items-center justify-center gap-3 bottom-10 sm:top-2 sm:bottom-auto left-10 sm:left-2"
        >
          <ArrowWhite width={14} height={14} className="rotate-180" />
          <span>PREV</span>
        </Link>
      ) : (
        <div className="absolute  flex items-center justify-center gap-3 opacity-25 bottom-10 sm:top-2 sm:bottom-auto left-10 sm:left-2">
          <ArrowWhite width={14} height={14} className="rotate-180" />
          <span>PREV</span>
        </div>
      )}
      {nextListingId ? (
        <Link
          href={`/listings/${nextListingId}`}
          className="absolute  flex items-center justify-center gap-3 bottom-10 sm:top-2 sm:bottom-auto right-10 sm:right-2"
        >
          <span>NEXT</span>
          <ArrowWhite width={14} height={14} />
        </Link>
      ) : (
        <div className="absolute  flex items-center justify-center gap-3 opacity-25 bottom-10 sm:top-2 sm:bottom-auto right-10 sm:right-2">
          <span>NEXT</span>
          <ArrowWhite width={14} height={14} />
        </div>
      )}
    </div>
  );
}
