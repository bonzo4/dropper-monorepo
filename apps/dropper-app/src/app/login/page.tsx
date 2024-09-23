"use client";
import { Button } from "@repo/ui";
import { createSupabaseClient } from "@repo/lib/supabase";
import { cn } from "@repo/ui/utils";
import { Notification } from "@repo/ui/icons";
import { useState } from "react";
import { Checkbox } from "@repo/ui";
import { Input } from "@repo/ui";
import { mono } from "@repo/ui/utils";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import logoWhite from "@/public/Dropper_Logo_White.png";
import Image from "next/image";

export default function Login() {
  const supabase = createSupabaseClient();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const handleMagicLinkLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const referral = searchParams.get("referral");
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback/?newsletter=${newsletter}&referral=${referral}`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setEmailSent(true);
    setLoading(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <main className="flex flex-col items-center justify-center grow gap-12">
      <div className="flex flex-col items-center justify-center px-5 ">
        <Image src={logoWhite} alt="Dropper Logo" height={100} />
      </div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <div className="self-stretch flex flex-col items-center justify-center gap-[20px] text-primary ">
          {!emailSent && (
            <form
              className="flex flex-col gap-4"
              onSubmit={handleMagicLinkLogin}
            >
              <div className={cn(mono.className, "w-full")}>
                <Input
                  className={cn(mono.className, "w-full")}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email"
                />
              </div>
              <Button
                className="self-stretch rounded-lg bg-secondary flex flex-row items-center justify-center py-2 pr-2.5 pl-3 gap-[8px]"
                disabled={loading}
                type="submit"
              >
                <Notification width={20} />
                <span className="relative text-[14px]">
                  Login with Magic Link
                </span>
              </Button>
            </form>
          )}
          {emailSent && (
            <div>
              <span>Login Email sent, please check your inbox.</span>
            </div>
          )}
        </div>
        <div className="overflow-hidden flex flex-row items-start justify-start gap-[10px] ">
          <Checkbox
            checked={newsletter}
            onClick={() => setNewsletter(!newsletter)}
          />
          <p
            className={cn(
              mono.className,
              "w-[300px] text-[10px] sm:text-[12px] relative whitespace-pre-wrap break-words flex items-center shrink-0"
            )}
          >
            By logging in you agree to sign up for the Dropper Newsletter and
            receive emails from <span>newsletter@</span>
            <span>syndicatenetwork.io</span> to the email associated with the
            connected account.
          </p>
        </div>
      </div>
    </main>
  );
}
