"use client";
import Button from "@/components/ui/Button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/classNames";
import {
  Google,
  Icon,
  Logo,
  LogoWhite,
  Notification,
} from "@/components/icons";
import { useState } from "react";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { mono } from "@/lib/utils/fonts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createSupabaseClient();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [newsletter, setNewsletter] = useState(true);

  const handleMagicLinkLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback?newsletter=${newsletter}`,
      },
    });
    console.log(data);
    if (error) return toast.error(error.message);
    setEmailSent(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <main className="flex flex-col items-center justify-center grow gap-12">
      <div className="flex flex-col items-center justify-center px-5 ">
        <LogoWhite height={100} />
      </div>
      <div className="flex flex-col items-center justify-center gap-[20px]">
        <div className="self-stretch flex flex-col items-center justify-center gap-[20px] text-primary ">
          {!emailSent && (
            <div className="flex flex-col gap-4">
              <Input
                className={cn(mono.className)}
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
              />
              <Button
                className="self-stretch rounded-lg bg-secondary flex flex-row items-center justify-center py-2 pr-2.5 pl-3 gap-[8px]"
                onClick={handleMagicLinkLogin}
              >
                <Notification width={20} />
                <span className="relative text-[14px]">
                  Login with Magic Link
                </span>
              </Button>
            </div>
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
              "w-[300px] text-[12px] relative whitespace-pre-wrap flex items-center shrink-0"
            )}
          >
            By logging in you agree to sign up for the Dropper Newsletter and
            receive emails from newsletter@syndicatenetwork.io to the email
            associated with the connected account.
          </p>
        </div>
      </div>
    </main>
  );
}
