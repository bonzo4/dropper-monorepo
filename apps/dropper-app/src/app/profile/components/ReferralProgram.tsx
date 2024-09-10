"use client";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { toast } from "react-toastify";

type Props = {
  referral_id: string;
};

export default function ReferralProgram({ referral_id }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://dropper.wtf/login/?code=${referral_id}`
    );
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col w-full gap-2 px-8">
      <h2 className="text-3xl">Referral Program</h2>
      <p className={cn(mono.className, "text-sm")}>
        Share this link and invite other users to Dropper to gain referral
        points and earn prizes.
      </p>

      <p className={cn(mono.className, "text-sm text-primary")}>
        Your referral link: https://dropper.wtf/login/?code={referral_id}
      </p>
      <Button className="w-[100px]" onClick={handleCopy}>
        Copy
      </Button>
    </div>
  );
}
