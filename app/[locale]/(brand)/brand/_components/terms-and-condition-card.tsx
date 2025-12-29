import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileText,
  Package,
  ScrollText,
  Target,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

const TermsAndConditionCard = () => {
  const t = useTranslations("influencer.campaign-details");
  return (
    <CollapseCard title="Breif and Terms & condition">
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        {/* ================= LEFT : CAMPAIGN BRIEF ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-Primary font-semibold mb-4 pt-4 md:pt-0">
            <FileText className="w-5 h-5" />
            <span className="text-base">Campaign Brief</span>
          </div>

          <div className="space-y-2">
            <Section
              icon={Target}
              title="Campaign Goals"
              text="Promote our new summer skincare line to Gen Z and Millennial audiences. Focus on natural ingredients and sustainable packaging."
            />

            <Section
              icon={Package}
              title="Product/Service Details"
              text="Highlight key product benefits, ingredients, and value proposition clearly and authentically."
            />

            <div>
              <div className="flex items-center gap-2 text-Primary font-medium mb-1">
                <ClipboardList className="w-4 h-4" />
                <h4>Content Requirements</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                <li>Minimum 2 Instagram Feed Posts</li>
                <li>3 Stories With Swipe Up Links</li>
                <li>1 YouTube Short (30–60 Seconds)</li>
                <li>3 TikTok Videos Featuring Trending Sounds</li>
              </ul>
            </div>
            <DoDont />
          </div>
        </div>

        {/* separator */}
        <div className="h-auto w-0.5 bg-dark-gray items-start" />

        {/* ================= RIGHT : TERMS & CONDITIONS ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-Primary font-semibold">
            <ScrollText className="w-5 h-5" />
            <span className="text-base ">Terms & Conditions</span>
          </div>
          <div className="space-y-3">
            <Section
              icon={BarChart3}
              title="Reporting Requirements"
              text="Provide analytics screenshots 7 days post-publication including reach, engagement, and CTR."
            />
            <Section
              icon={ScrollText}
              title={t("Usage Rights")}
              text="Brand may reuse submitted content on official channels with proper attribution."
            />
          </div>
        </div>
      </div>
    </CollapseCard>
  );
};

export default TermsAndConditionCard;

function Section({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-Primary font-medium mb-1">
        <Icon className="w-4 h-4 shrink-0" />
        <h4 className="text-sm md:text-base">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}

function DoDont() {
  const t = useTranslations("influencer.campaign-details");
  return (
    <div className="space-y-3 mt-4">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t("Do’s")}</span>
        </div>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Show authentic usage</li>
          <li>• Tag @StyleCo in all posts</li>
          <li>• Use natural lighting</li>
          <li>• Include discount codes</li>
        </ul>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
          <XCircle className="w-4 h-4" />
          <span>{t("Don’ts")}</span>
        </div>
        <ul className="text-sm text-red-600 space-y-1">
          <li>• Misrepresent product claims</li>
          <li>• Use misleading filters</li>
          <li>• Post without brand tags</li>
          <li>• Alter messaging without approval</li>
        </ul>
      </div>
    </div>
  );
}
