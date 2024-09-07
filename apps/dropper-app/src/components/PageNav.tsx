type Props = {
  page: number;
  prevPage: (page: number) => void;
  nextPage: (page: number) => void;
  docCount: number;
  maxDocs: number;
};

export default function PageNav({
  page,
  prevPage,
  nextPage,
  docCount,
  maxDocs,
}: Props) {
  return (
    <div className="flex justify-center gap-4">
      <button
        className="text-white"
        onClick={() => prevPage(page)}
        disabled={page === 1}
        style={{ opacity: page === 1 ? "25%" : "100%" }}
      >
        Previous
      </button>
      <span className="text-white">{page}</span>
      <button
        className="text-white"
        onClick={() => nextPage(page)}
        disabled={docCount <= maxDocs}
        style={{
          opacity: docCount <= maxDocs ? "25%" : "100%",
        }}
      >
        Next
      </button>
    </div>
  );
}
