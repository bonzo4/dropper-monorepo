"use client";
import { Button } from "@repo/ui";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { toast } from "react-toastify";

type Props = {
  referral_id: string;
};

export default function ReferralProgram({ referral_id }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://dropper.wtf/login/?referral=${referral_id}`
    );
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex w-full px-8">
      <div className="flex flex-col gap-4 border-2 border-primary rounded-md px-2 py-4">
        <h2 className="text-3xl">Referral Program</h2>
        <p className={cn(mono.className, "text-sm")}>
          Invite other users to Dropper to gain referral points and receive
          exclusive benefits.
        </p>

        <p className={cn(mono.className, "text-sm text-primary")}>
          Your referral link: https://dropper.wtf/login/?referral={referral_id}
        </p>
        <Button className="w-[100px]" onClick={handleCopy}>
          Copy Link
        </Button>
      </div>
    </div>
  );
}
