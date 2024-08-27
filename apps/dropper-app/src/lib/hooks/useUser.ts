import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Database } from "../supabase/types";

type UseUserOptions = {
  supabase: SupabaseClient<Database>;
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
