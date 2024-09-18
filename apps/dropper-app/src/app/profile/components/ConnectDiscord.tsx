"use client";
import { Button } from "@repo/ui";
import { deleteDiscordAccount } from "@/lib/actions/profile/deleteDiscordAccount";
import { DiscordAccount } from "@/lib/types/profile";
import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  discordAccount: DiscordAccount | null;
};

export default function ConnectDiscord({ discordAccount }: Props) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!discordAccount) return;
    deleteDiscordAccount({ userId: discordAccount.user_id });
    router.refresh();
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="text-3xl">Connect Discord</h2>
      {!discordAccount && (
        <a
          href="https://discord.com/oauth2/authorize?client_id=1218366674449989735&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%2Fdiscord&scope=identify"
          className=""
        >
          <Button>Link Discord</Button>
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
