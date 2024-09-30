"use client";

import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { submitCode } from "@/lib/actions/submitCode";
import { createSupabaseClient } from "@repo/lib/supabase";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CodeSubmit() {
  const supabase = createSupabaseClient();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("accessCode");
    if (code) {
      setCode(code);
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const checkCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return toast.error("You must be logged in to submit a code");
    const { data, error } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (error) {
      setLoading(false);
      toast.error("Invalid access code");
      return;
    }

    if (data.limit && data.used_count >= data.limit) {
      setLoading(false);
      return toast.error("Access code has been used too many times");
    }

    const response = await submitCode({
      code,
      userId: user.id,
    });

    if (response) {
      setLoading(false);
      return toast.error("Invalid access code");
    }

    router.refresh();
  };

  return (
    <form
      className="flex flex-row gap-2 items-center justify-center"
      onSubmit={checkCode}
    >
      <div className={cn(mono.className, "")}>
        <Input
          placeholder="Access Code"
          value={code}
          onChange={handleCodeChange}
        />
      </div>
      <Button disabled={loading} type="submit">
        Submit
      </Button>
    </form>
  );
}
