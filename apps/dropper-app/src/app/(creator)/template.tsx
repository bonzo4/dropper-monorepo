"use client";

import ToastStyling from "@/components/ToastStyling";
import Wallet from "@/components/Wallet";

export default function CreatorTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wallet>
      {children}
      <ToastStyling />
    </Wallet>
  );
}
