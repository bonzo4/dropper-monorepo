"use client";

import ToastStyling from "@/components/ToastStyling";
import Wallet from "@/components/Wallet";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CreatorTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("code")) {
      router.refresh();
    }
  }, [searchParams, router]);

  return (
    <Wallet>
      {children}
      <ToastStyling />
    </Wallet>
  );
}
