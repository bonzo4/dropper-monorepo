import { ListingCardData } from "@/app/api/listing/route";
import { useEffect, useState } from "react";

type Options = {
  initialListings: ListingCardData[];
  page?: number;
};

export function useListings({ page = 1 }: Options) {
  const [loading, setLoading] = useState(false);
  const [listingsData, setListings] = useState<ListingCardData[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/listing?page=${page}`,
        {
          cache: "no-cache",
        }
      );

      if (response.status !== 200) {
        setListings([]);
      } else {
        const data = (await response.json()) as ListingCardData[];
        setListings(data);
      }

      setLoading(false);
    };

    fetchListings();
  }, [page]);

  return { listingsData, loading } as const;
}
