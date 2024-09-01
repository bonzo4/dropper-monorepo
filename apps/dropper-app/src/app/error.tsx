"use client"; // Error components must be Client Components

import Button from "@repo/ui/Button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center grow space-y-4">
      <h2>Something went wrong!: {error.message}</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.back()
        }
      >
        Go Back
      </Button>
    </main>
  );
}
