import { DatabaseTypes } from "@repo/app-types/database";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DropmanRow, DropmanView } from "../types/user";

type UseUserOptions = {
  supabase: SupabaseClient<DatabaseTypes>;
};

export function useUser({ supabase }: UseUserOptions) {
  //   const [user, setUser] = useState<User | null>(null);
  const [dropman, setDropman] = useState<DropmanRow | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      //   setUser(user);

      if (!user) return;

      const { data: dropman } = await supabase
        .from("dropmans")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setDropman(dropman);
    };
    fetchUser();
  }, [supabase]);

  return { dropman } as const;
}
