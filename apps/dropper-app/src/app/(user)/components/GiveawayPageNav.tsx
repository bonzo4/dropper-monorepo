type GiveawayPageNavProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  giveawayCount: number;
};

export default function GiveawayPageNav({
  page,
  setPage,
  giveawayCount,
}: GiveawayPageNavProps) {
  return (
    <div className="flex justify-center gap-4">
      <button
        className="text-white"
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 1}
        style={{ opacity: page === 1 ? "25%" : "100%" }}
      >
        Previous
      </button>
      <span className="text-white">{page}</span>
      <button
        className="text-white"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={giveawayCount < 12}
        style={{
          opacity: giveawayCount < 12 ? "25%" : "100%",
        }}
      >
        Next
      </button>
    </div>
  );
}
