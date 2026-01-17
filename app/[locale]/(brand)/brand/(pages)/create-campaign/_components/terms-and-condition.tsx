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
  Calendar,
  Clock,
} from "lucide-react";
import type { CampaignApi } from "@/app/[locale]/(brand)/brand/types/client-types";

type Props = { campaign: CampaignApi | null };

const TermsAndConditionCard = ({ campaign }: Props) => {
  return (
    <CollapseCard title="Brief and Terms & Conditions">
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2 text-Primary font-semibold mb-4 pt-4 md:pt-0">
            <FileText className="w-5 h-5" />
            <span className="text-base">Campaign Brief</span>
          </div>

          <div className="space-y-2">
            <Section
              icon={Target}
              title="Campaign Goals"
              text={campaign?.campaignGoals || "No campaign goals provided"}
            />

            <Section
              icon={Package}
              title="Product/Service Details"
              text={
                campaign?.productServiceDetails || "No product details provided"
              }
            />

            <div>
              <div className="flex items-center gap-2 text-Primary font-medium mb-1">
                <ClipboardList className="w-4 h-4" />
                <h4>Campaign Timeline</h4>
              </div>

              <div className="text-sm text-gray-600 space-y-1 ml-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Starting Date: {campaign?.startingDate || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {campaign?.duration ?? "Not specified"}</span>
                </div>
              </div>
            </div>

            <DoDont dos={campaign?.dos || ""} donts={campaign?.donts || ""} />
          </div>
        </div>

        <div className="h-auto w-0.5 bg-dark-gray items-start" />

        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2 text-Primary font-semibold">
            <ScrollText className="w-5 h-5" />
            <span className="text-base">Terms & Conditions</span>
          </div>

          <div className="space-y-3">
            <Section
              icon={BarChart3}
              title="Reporting Requirements"
              text={
                campaign?.reportingRequirements ||
                "No reporting requirements specified"
              }
            />
            <Section
              icon={ScrollText}
              title="Usage Rights"
              text={campaign?.usageRights || "No usage rights specified"}
            />
            <Section
              icon={ScrollText}
              title="Terms & Conditions"
              text={
                campaign?.termsConditions || "No terms and conditions specified"
              }
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
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}

function DoDont({ dos, donts }: { dos: string; donts: string }) {
  const textToBulletPoints = (text: string): string[] => {
    if (!text.trim()) return ["No items specified"];
    return text
      .split(/[\n•]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => (item.startsWith("•") ? item.substring(1).trim() : item));
  };

  const dosList = textToBulletPoints(dos);
  const dontsList = textToBulletPoints(donts);

  return (
    <div className="space-y-3 mt-4 w-full ">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Do&apos;s</span>
        </div>
        <ul className="text-sm text-green-700 space-y-1">
          {dosList.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
          <XCircle className="w-4 h-4" />
          <span>Don&apos;ts</span>
        </div>
        <ul className="text-sm text-red-600 space-y-1">
          {dontsList.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
