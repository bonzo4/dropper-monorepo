type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  docCount: number;
  maxDocs: number;
};

export default function PageNav({ page, setPage, docCount, maxDocs }: Props) {
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
