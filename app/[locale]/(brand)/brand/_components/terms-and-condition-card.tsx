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
import type { CampaignApi } from "@/app/[locale]/(brand)/brand/types/client-types";

type Props = {
  campaign: CampaignApi;
};

const toBullets = (text?: string | null) => {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => (x.startsWith("•") ? x.slice(1).trim() : x));
};

export default function TermsAndConditionCard({ campaign }: Props) {
  const dos = toBullets(campaign.dos);
  const donts = toBullets(campaign.donts);

  return (
    <CollapseCard title="Brief and Terms & condition">
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        {/* LEFT */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-Primary font-semibold mb-4 pt-4 md:pt-0">
            <FileText className="w-5 h-5" />
            <span className="text-base">Campaign Brief</span>
          </div>

          <div className="space-y-2">
            <Section
              icon={Target}
              title="Campaign Goals"
              text={campaign.campaignGoals || "—"}
            />

            <Section
              icon={Package}
              title="Product/Service Details"
              text={campaign.productServiceDetails || "—"}
            />

            <div>
              <div className="flex items-center gap-2 text-Primary font-medium mb-1">
                <ClipboardList className="w-4 h-4" />
                <h4>Terms & Conditions</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {campaign.termsConditions || "—"}
              </p>
            </div>

            <DoDont dos={dos} donts={donts} />
          </div>
        </div>

        <div className="h-auto w-0.5 bg-dark-gray items-start" />

        {/* RIGHT */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-Primary font-semibold">
            <ScrollText className="w-5 h-5" />
            <span className="text-base">Terms & Conditions</span>
          </div>

          <div className="space-y-3">
            <Section
              icon={BarChart3}
              title="Reporting Requirements"
              text={campaign.reportingRequirements || "—"}
            />
            <Section
              icon={ScrollText}
              title="Usage Rights"
              text={campaign.usageRights || "—"}
            />
          </div>
        </div>
      </div>
    </CollapseCard>
  );
}

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

function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="space-y-3 mt-4">
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Do’s</span>
        </div>

        {dos.length ? (
          <ul className="text-sm text-green-700 space-y-1">
            {dos.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-green-700/70">—</p>
        )}
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
          <XCircle className="w-4 h-4" />
          <span>Don’ts</span>
        </div>

        {donts.length ? (
          <ul className="text-sm text-red-600 space-y-1">
            {donts.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-red-600/70">—</p>
        )}
      </div>
    </div>
  );
}
