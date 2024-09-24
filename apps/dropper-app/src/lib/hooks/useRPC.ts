import { useEffect, useState } from "react";
import { getRPC, getWSS } from "../actions/getRPC";

export function useRPC() {
  const [rpcUrl, setRpcUrl] = useState<string>("");
  const [wssUrl, setWssUrl] = useState<string>("");

  useEffect(() => {
    async function fetchRPC() {
      const rpcData = getRPC();
      const wssData = getWSS();
      const [rpc, wss] = await Promise.all([rpcData, wssData]);
      setRpcUrl(rpc);
      setWssUrl(wss);
    }
    fetchRPC();
  }, []);

  return { rpcUrl, wssUrl } as const;
}
