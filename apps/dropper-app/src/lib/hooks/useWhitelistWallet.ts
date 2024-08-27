import { useEffect, useState } from "react";

type UseWhitelistWalletOptions = {
  publicKey: string | null;
};

export function useWhitelistWallet({ publicKey }: UseWhitelistWalletOptions) {
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkWhitelist = async () => {
      if (!publicKey) return setIsWhitelisted(false);
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/whitelist?dev=true&key=${publicKey}`,
        {
          cache: "no-cache",
        }
      );
      setLoading(false);
      if (response.status != 200) return setIsWhitelisted(false);
      setIsWhitelisted(true);
    };
    checkWhitelist();
  }, [publicKey]);

  return { isWhitelisted, loading } as const;
}
