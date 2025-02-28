import { ListingInsert } from "@/lib/types/listing";

export function checkListing(listing: ListingInsert) {
  if (!listing.name) {
    throw new Error("Listing name is required");
  }
  if (!listing.ticker) {
    throw new Error("Listing ticker is required");
  }
  if (!listing.description) {
    throw new Error("Listing description is required");
  }
  if (!listing.icon_url) {
    throw new Error("Listing icon URL is required");
  }
  if (!listing.chain) {
    throw new Error("Listing chain is required");
  }
  if (!listing.token_address) {
    throw new Error("Listing token address is required");
  }
}
