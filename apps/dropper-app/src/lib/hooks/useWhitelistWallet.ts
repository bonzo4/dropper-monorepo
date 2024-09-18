import { useEffect, useState } from "react";
import { createSupabaseClient } from "@repo/lib/supabase";

type UseWhitelistWalletOptions = {
  publicKey: string | null;
};

export function useWhitelistWallet({ publicKey }: UseWhitelistWalletOptions) {
  const supabase = createSupabaseClient();
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkWhitelist = async () => {
      if (!publicKey) return setIsWhitelisted(false);
      setLoading(true);

      const { data, error } = await supabase
        .from("solana_wallets")
        .select("*")
        .eq("address", publicKey)
        .single();

      if (data) setIsWhitelisted(true);
      else setIsWhitelisted(false);

      setLoading(false);
    };
    checkWhitelist();
  }, [publicKey, supabase]);

  return { isWhitelisted, loading } as const;
}
