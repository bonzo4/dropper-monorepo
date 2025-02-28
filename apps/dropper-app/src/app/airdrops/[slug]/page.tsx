import { Tab } from "@repo/ui";
import AboutSection from "./components/AboutSection";
import QuestsSections from "./components/QuestSection";
import {
  AboutSectionRow,
  CommunityPostRow,
  CommunitySectionRow,
  AirdropPageRow,
  AirdropTeamMemberRow,
  QuestItemRow,
  QuestRow,
  QuestSectionRow,
  SectionType,
} from "@/lib/types/sections";
import AirdropInfo from "./components/AirdropInfo";
import AirdropStats from "./components/AirdropStats";
import Image from "next/image";
import CommunitySection from "./components/CommunitySection";
import CommentSection from "./components/CommentSection";
import { createSupabaseServer } from "@repo/lib/supabase";
import { getAirdropPageData } from "@/lib/data/airdrops/getAirdropPage";

export default async function Airdrop({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const supabase = await createSupabaseServer();
  const airdrop = await getAirdropPageData({ supabase, slug });

  if (!airdrop || !airdrop.is_published) return null;

  const sections = [
    ...airdrop.airdrop_about_sections.map((section) => ({
      ...section,
      type: SectionType.About,
    })),
    ...airdrop.airdrop_quest_sections.map((section) => ({
      ...section,
      type: SectionType.Quests,
    })),
    ...airdrop.airdrop_community_sections.map((section) => ({
      ...section,
      type: SectionType.Community,
    })),
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col items-center justify-start grow py-20">
      <div className="w-full relative overflow-hidden flex flex-col items-center justify-start gap-[40px] max-w-[737px]">
        <AirdropInfo airdrop={airdrop} />
        <AirdropStats airdrop={airdrop} />
        {airdrop.banner_url && (
          <Image
            src={airdrop.banner_url}
            alt="banner image"
            width={737}
            height={0}
            style={{ height: "auto", maxWidth: "737px" }}
          />
        )}
        {sections.map((section) => {
          switch (section.type) {
            case SectionType.About:
              return (
                <Tab label="About" key={`about_${section.id}`}>
                  <AboutSection
                    section={
                      section as AboutSectionRow & {
                        airdrop_team_members: AirdropTeamMemberRow[];
                      }
                    }
                  />
                </Tab>
              );
            case SectionType.Quests:
              return (
                <Tab
                  label={`How to earn $${airdrop.symbol}`}
                  key={`quests_${section.id}`}
                >
                  <QuestsSections
                    section={
                      section as QuestSectionRow & {
                        airdrop_quests: (QuestRow & {
                          airdrop_quest_items: QuestItemRow[];
                        })[];
                      }
                    }
                  />
                </Tab>
              );
            case SectionType.Community:
              return (
                <Tab
                  label="Community"
                  key={`community_${section.id}`}
                  className="w-full"
                >
                  <CommunitySection
                    section={
                      section as CommunitySectionRow & {
                        airdrop_community_posts: CommunityPostRow[];
                      }
                    }
                  />
                </Tab>
              );
          }
        })}
        <Tab label="Comments" className="w-full">
          <CommentSection airdropId={airdrop.id} />
        </Tab>
      </div>
    </div>
  );
}
