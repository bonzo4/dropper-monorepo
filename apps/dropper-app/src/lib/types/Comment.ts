import { DatabaseTypes } from "@repo/app-types/database";
import { DropmanView } from "./user";

export type AirdropCommentRow =
  DatabaseTypes["public"]["Tables"]["airdrop_comments"]["Row"] & {
    user?: DropmanView;
  };
