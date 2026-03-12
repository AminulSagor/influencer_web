"use client";

import { CircleDot, Eye, Heart, MessageCircle, Play } from "lucide-react";
import { CampaignMilestone } from "@/types/client/campaigns/campaign-details";
import {
  formatMilestoneDate,
  getMilestoneStatusClasses,
  getMilestoneStatusLabel,
} from "../milestone-ui-helpers";
import MilestoneReportActions from "./milestone-report-actions";

type ActionButtonsProps = {
  milestone: CampaignMilestone;
  submissionId?: string | null;
};

type StatusCardProps = {
  milestone: CampaignMilestone;
};

type MetricCardProps = {
  label: string;
  value?: number | string | null;
  icon?: React.ReactNode;
};

type RequirementListProps = {
  contentQuantity?: string | null;
};

type PromoGoalProps = {
  goal?: string | null;
};

type PromotionTargetProps = {
  platform?: string | null;
  label?: string;
  value?: number | string | null;
};

function normalizeStatus(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

function formatCompactValue(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "0";

  const numeric =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));

  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    if (numeric >= 1000000) return `${Math.round(numeric / 100000) / 10}M`;
    if (numeric >= 1000) return `${Math.round(numeric / 100) / 10}K`;
    return `${numeric}`;
  }

  return String(value);
}

function toTitleCase(value?: string | null) {
  const text = String(value ?? "").trim();
  if (!text) return "—";

  return text
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
}

function getEffectiveStatus(milestone: CampaignMilestone) {
  const raw = milestone?.status;
  return normalizeStatus(raw);
}

function getStatusDate(milestone: CampaignMilestone) {
  return formatMilestoneDate(milestone?.updatedAt ?? milestone?.createdAt);
}

function splitRequirements(contentQuantity?: string | null) {
  const raw = String(contentQuantity ?? "").trim();
  if (!raw) return ["No requirement provided"];

  const pieces = raw
    .split(/\s*\+\s*|,\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  return pieces.length ? pieces : [raw];
}

export function RequirementList({ contentQuantity }: RequirementListProps) {
  const items = splitRequirements(contentQuantity);

  return (
    <div>
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F] sm:text-base">
        Content Requirements
      </h4>

      <ul className="mt-2.5 space-y-1.5 pl-4 text-xs leading-5 text-[#355B25] sm:mt-3 sm:space-y-2 sm:pl-5 sm:text-sm">
        {items.map((item) => (
          <li
            key={item}
            className="list-disc break-words marker:text-[#355B25]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PromotionGoalBlock({ goal }: PromoGoalProps) {
  return (
    <div className="mt-4 sm:mt-5">
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F] sm:text-base">
        Promotion Goal
      </h4>

      <p className="mt-2.5 text-xs leading-5 text-[#355B25] sm:mt-3 sm:text-sm sm:leading-6">
        {String(goal ?? "").trim() || "No promotion goal provided"}
      </p>
    </div>
  );
}

export function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="rounded-[12px] border border-[#5D7F43] bg-transparent px-3 py-2.5 sm:rounded-[14px] sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium leading-none text-[#355B25] sm:text-sm">
          {label}
        </span>

        {icon ? (
          <span className="shrink-0 text-[#4C5138] [&_svg]:h-3.5 [&_svg]:w-3.5 sm:[&_svg]:h-4 sm:[&_svg]:w-4">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-2.5 text-xl font-semibold leading-none text-[#2E5B1F] sm:mt-3 sm:text-[28px]">
        {formatCompactValue(value)}
      </p>
    </div>
  );
}

export function MilestoneTargetGrid({
  milestone,
}: {
  milestone: CampaignMilestone;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F] sm:text-base">
        Milestone Target
      </h4>

      <div className="mt-2.5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:mt-3 sm:gap-3">
        <MetricCard
          label="Reach"
          value={milestone?.expectedReach}
          icon={<Eye />}
        />
        <MetricCard
          label="Views"
          value={milestone?.expectedViews}
          icon={<Play className="fill-current" />}
        />
        <MetricCard
          label="Reaction"
          value={milestone?.expectedLikes}
          icon={<Heart className="fill-current" />}
        />
        <MetricCard
          label="Comment"
          value={milestone?.expectedComments}
          icon={<MessageCircle className="fill-current" />}
        />
      </div>
    </div>
  );
}

export function PromotionTargetBlock({
  platform,
  label,
  value,
}: PromotionTargetProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F] sm:text-base">
        Promotion Target
      </h4>

      <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-2.5">
        <p className="text-xs font-medium leading-none text-[#355B25] sm:text-sm">
          {toTitleCase(platform)}
        </p>

        <p className="text-xs font-medium leading-none text-[#355B25] sm:text-sm">
          {label || "Reach"}
        </p>

        <p className="text-xl font-semibold leading-none text-[#2E5B1F] sm:text-[30px]">
          {formatCompactValue(value)}
        </p>
      </div>
    </div>
  );
}

export function MilestoneActions({
  submissionId,
}: ActionButtonsProps) {
  return <MilestoneReportActions submissionId={submissionId} />;
}

export function MilestoneStatusCard({ milestone }: StatusCardProps) {
  const effectiveStatus = getEffectiveStatus(milestone);
  const statusClasses = getMilestoneStatusClasses(effectiveStatus);
  const label = getMilestoneStatusLabel(effectiveStatus) || "Pending";
  const statusDate = getStatusDate(milestone);

  return (
    <div
      className={[
        "flex min-h-[120px] w-full flex-col items-center justify-center rounded-[14px] border px-3 py-3 text-center sm:min-h-[138px] sm:rounded-[16px] sm:px-4 sm:py-4",
        statusClasses.wrapper,
      ].join(" ")}
    >
      <p className={["text-xs font-medium sm:text-sm", statusClasses.soft].join(" ")}>
        Status
      </p>

      <span
        className={[
          "mt-2.5 inline-flex min-h-[30px] max-w-full items-center justify-center rounded-full px-4 text-base font-semibold leading-none sm:mt-3 sm:min-h-[36px] sm:px-5 sm:text-[20px]",
          statusClasses.badge,
        ].join(" ")}
      >
        <span className="truncate">{label}</span>
      </span>

      <p
        className={[
          "mt-2.5 flex items-center gap-1.5 text-[10px] font-medium sm:mt-3 sm:text-xs",
          statusClasses.soft,
        ].join(" ")}
      >
        <CircleDot className="h-3 w-3 fill-current sm:h-3.5 sm:w-3.5" />
        {statusDate || "—"}
      </p>
    </div>
  );
}