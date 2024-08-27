import { getAirdrops } from "@/lib/data/getAirdrops";
import AirdropList from "./components/AirdropList";

type AirdropsProps = {
  searchParams: URLSearchParams;
};

export default async function Airdrops({ searchParams }: AirdropsProps) {
  const airdrops = await getAirdrops(searchParams);

  return (
    <div className="flex flex-col items-center justify-start grow py-20">
      <div className="max-w-[974px] lg:w-[974px]  flex flex-col items-start justify-start gap-[40px] grow">
        <h1 className="relative text-2xl md:text-[36px] py-5 ">
          Trending Airdrops
        </h1>
        <AirdropList airdrops={airdrops} />
      </div>
    </div>
  );
}
