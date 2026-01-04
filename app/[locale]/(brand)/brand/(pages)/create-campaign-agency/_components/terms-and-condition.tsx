import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";
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

const TermsAndConditionCard = () => {
  const stepThree = useFormStore((s) => s.stepThree);

  return (
    <CollapseCard title="Brief and Terms & Conditions">
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        {/* ================= LEFT : CAMPAIGN BRIEF ================= */}
        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2 text-Primary font-semibold mb-4 pt-4 md:pt-0">
            <FileText className="w-5 h-5" />
            <span className="text-base">Campaign Brief</span>
          </div>

          <div className="space-y-2">
            <Section
              icon={Target}
              title="Campaign Goals"
              text={stepThree.campaignGoals || "No campaign goals provided"}
            />

            <Section
              icon={Package}
              title="Product/Service Details"
              text={stepThree.productDetails || "No product details provided"}
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
                    Starting Date: {stepThree.startingDate || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {stepThree.duration || "Not specified"}</span>
                </div>
              </div>
            </div>

            <DoDont dos={stepThree.dos || ""} donts={stepThree.donts || ""} />
          </div>
        </div>

        {/* separator */}
        <div className="h-auto w-0.5 bg-dark-gray items-start" />

        {/* ================= RIGHT : TERMS & CONDITIONS ================= */}
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
                stepThree.reportingRequirements ||
                "No reporting requirements specified"
              }
            />
            <Section
              icon={ScrollText}
              title="Usage Rights"
              text={stepThree.usageRights || "No usage rights specified"}
            />
            <Section
              icon={ScrollText}
              title="Terms & Conditions"
              text={
                stepThree.termsConditions || "No terms and conditions specified"
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

interface DoDontProps {
  dos: string;
  donts: string;
}

function DoDont({ dos, donts }: DoDontProps) {
  // Function to convert text to bullet points
  const textToBulletPoints = (text: string): string[] => {
    if (!text.trim()) return ["No items specified"];

    // Split by new lines or bullet points
    return text
      .split(/[\n•]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
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
