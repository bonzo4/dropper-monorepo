export default function ListingCard() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="h-[83px] w-[83px] bg-placeholder" />
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <span>$TICKER</span>
            <div className="flex flex-row">
              <div className="w-[21px] h-[21px] bg-placeholder" />
              <div className="w-[21px] h-[21px] bg-placeholder" />
              <div className="w-[21px] h-[21px] bg-placeholder" />
              <div className="w-[21px] h-[21px] bg-placeholder" />
            </div>
            <span>bump</span>
          </div>
          <span>
            Token name<span className="">description</span>
          </span>
        </div>
      </div>
    </div>
  );
}
