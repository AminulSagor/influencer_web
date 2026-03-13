import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Package,
  ScrollText,
  Target,
  XCircle,
} from "lucide-react";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

type Props = {
  campaign: ClientCampaignDetails;
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
    <CollapseCard title="Brief and Terms & Condition">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:gap-12">
        <div className="space-y-4">
          <div className="mb-4 flex items-center gap-2 pt-4 font-semibold text-Primary md:pt-0">
            <FileText className="h-5 w-5" />
            <span className="text-base">Campaign Brief</span>
          </div>

          <div className="space-y-4">
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

            <DoDont dos={dos} donts={donts} />
          </div>
        </div>

        <div className="hidden w-px bg-dark-gray lg:block" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-Primary">
            <ScrollText className="h-5 w-5" />
            <span className="text-base">Terms & Conditions</span>
          </div>

          <div className="space-y-4">
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
      <div className="mb-1 flex items-center gap-2 font-medium text-Primary">
        <Icon className="h-4 w-4 shrink-0" />
        <h4 className="text-sm">{title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{text}</p>
    </div>
  );
}

function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-xl border border-light-green-200 bg-light-green-50 p-4">
        <div className="mb-2 flex items-center gap-2 font-medium text-light-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Do’s</span>
        </div>

        {dos.length ? (
          <ul className="space-y-1 text-sm text-light-green-700">
            {dos.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-light-green-700/70">—</p>
        )}
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="mb-2 flex items-center gap-2 font-medium text-red-600">
          <XCircle className="h-4 w-4" />
          <span className="text-sm">Don’ts</span>
        </div>

        {donts.length ? (
          <ul className="space-y-1 text-sm text-red-600">
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
