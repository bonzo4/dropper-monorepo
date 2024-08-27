import { Database } from "../supabase/types";
import { DropmanView } from "./user";

export type AirdropCommentRow =
  Database["public"]["Tables"]["airdrop_comments"]["Row"] & {
    user?: DropmanView;
  };
