import { DatabaseTypes } from "@repo/types/database";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type UseUserOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export function useUser({ supabase }: UseUserOptions) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  return { user } as const;
}
