import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { SquarePen, Instagram, Youtube, Music2 } from "lucide-react";
import { useTranslations } from "next-intl";

const socials = [
  {
    icon: Instagram,
    value: "@haniaa_amir",
  },
  {
    icon: Youtube,
    value: "@haniaa_amir",
  },
  {
    icon: Music2, // closest to TikTok style in Lucide
    value: "@haniaa_amir",
  },
];

export default function SocialLinksCard() {
  const t = useTranslations("influencer.account-setting");

  return (
    <div>
      <CollapseCard title={t("Social Links")}>
        {/* Social inputs */}
        <div className="space-y-3 mb-6">
          {socials.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-center gap-3">
                {/* Platform icon */}
                <Icon className="w-5 h-5 text-[#2D5016]" />

                {/* Input */}
                <div className="flex items-center flex-1 border rounded-lg px-3 py-2">
                  <input
                    disabled
                    value={item.value}
                    className="flex-1 bg-transparent text-sm text-gray-600 outline-none"
                  />

                  {/* Orange status dot */}
                  <span className="w-2 h-2 rounded-full bg-[#E57A1F] mx-3" />

                  {/* Edit icon */}
                  <SquarePen className="w-4 h-4 text-[#6B7A4C] cursor-pointer" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add button */}
        <button className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC]">
          {t("+ Add another social link")}
        </button>
      </CollapseCard>
    </div>
  );
}
