"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const redirectUrl = searchParams.get("next") || "/";
      router.replace(redirectUrl);
      router.refresh();
    };
    redirect();
  }, [router, searchParams]);

  return (
    <main className="flex flex-col w-full grow items-center justify-center">
      <h1 className="text-2xl">Redirecting...</h1>
      <span>Please do not click away from this page. </span>
    </main>
  );
}
