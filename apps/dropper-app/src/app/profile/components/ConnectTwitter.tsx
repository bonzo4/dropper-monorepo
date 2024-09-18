"use client";
import { Button } from "@repo/ui";
import { deleteDiscordAccount } from "@/lib/actions/profile/deleteDiscordAccount";
import { DiscordAccount } from "@/lib/types/profile";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTwitterOauthLink } from "@/lib/actions/profile/getTwitterOauthLink";

type Props = {
  discordAccount: DiscordAccount | null;
};

export default function ConnectDiscord({ discordAccount }: Props) {
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const generateLink = async () => {
      const link = await getTwitterOauthLink();

      setLink(link);
    };

    generateLink();
  }, []);

  const router = useRouter();
  const handleDelete = async () => {
    if (!discordAccount) return;
    deleteDiscordAccount({ userId: discordAccount.user_id });
    router.refresh();
  };
  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="text-3xl">Connect Twitter</h2>
      {!discordAccount && (
        <a href={link || ""} className="">
          <Button>Link Twitter</Button>
        </a>
      )}
      {discordAccount && (
        <div className="flex flex-row gap-2 items-center">
          <div>
            <Button onClick={handleDelete}>Disconnect</Button>
          </div>
          <p className={cn(mono.className, "text-lg")}>
            Connected as {discordAccount.username}
          </p>
        </div>
      )}
    </div>
  );
}
