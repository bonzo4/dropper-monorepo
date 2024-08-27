import { AboutSectionRow, AirdropTeamMemberRow } from "@/lib/types/sections";
import { cn } from "@/lib/utils/classNames";
import { Telegram, Twitter } from "@/components/icons";
import Image from "next/image";

type AboutSectionProps = {
  section: AboutSectionRow & { airdrop_team_members: AirdropTeamMemberRow[] };
} & React.HTMLAttributes<HTMLDivElement>;

const AboutSection = ({ section, ...props }: AboutSectionProps) => {
  return (
    <div {...props} className="flex flex-col gap-[40px]">
      <div className="w-full relative overflow-hidden flex flex-col items-start justify-center py-0 px-5 box-border gap-[10px] text-left text-[20px] text-text font-fff-forward">
        <div className="flex flex-row items-center justify-start">
          <div className="relative">About</div>
        </div>
        <p className={cn("m-0 whitespace-pre-wrap py-0 px-10 text-[12px]")}>
          {section.description}
        </p>
      </div>
      {section.airdrop_team_members.length > 0 && (
        <div className="w-full relative flex flex-col items-start justify-center py-0 px-5 box-border gap-[10px] text-left text-[20px] text-text font-fff-forward">
          <div className="flex flex-row items-center justify-start">
            <div className="relative">Team</div>
          </div>
          <div className="self-stretch shrink-0 flex flex-row flex-wrap items-center gap-[10px] lg:justify-between text-xs font-made-outer-sans">
            {section.airdrop_team_members
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <div
                  key={member.id}
                  className=" flex flex-row items-center justify-start p-2.5 gap-[20px]"
                >
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    width={89}
                    height={89}
                    className="rounded-full"
                  />
                  <div
                    className={cn(
                      "flex flex-col items-start justify-center gap-[8px]"
                    )}
                  >
                    <span className="relative">{member.name}</span>
                    <span className="relative">{member.role}</span>
                    {(member.twitter_url ||
                      member.telegram_url ||
                      member.linkedin_url) && (
                      <div className="flex flex-row gap-2 items-center">
                        {member.twitter_url && (
                          <a href={member.twitter_url} target="_blank">
                            <Twitter width={16} />
                          </a>
                        )}
                        {member.telegram_url && (
                          <a href={member.telegram_url} target="_blank">
                            <Telegram width={16} />
                          </a>
                        )}
                        {/* {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank">
                            Linkedin
                          </a>
                        )} */}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSection;
