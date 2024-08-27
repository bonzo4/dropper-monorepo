"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { submitCode } from "@/lib/actions/submitCode";
import { createSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CodeSubmit() {
  const supabase = createSupabaseClient();

  const [code, setCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setCode(code);
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const checkCode = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return toast.error("You must be logged in to submit a code");
    const { data } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (!data) {
      return toast.error("Invalid access code");
    }

    const response = await submitCode({
      code,
      userId: user.id,
    });

    if (response) return toast.error("Invalid access code");

    router.refresh();
  };

  return (
    <div className="flex flex-row gap-2">
      {" "}
      <Input
        className={cn(mono.className, "")}
        placeholder="Access Code"
        value={code}
        onChange={handleCodeChange}
      />
      <Button onClick={checkCode}>Submit</Button>
    </div>
  );
}
