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
  return String(value ?? "")
    .trim()
    .toLowerCase();
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
  return normalizeStatus(milestone.status);
}

function getStatusDate(milestone: CampaignMilestone) {
  return formatMilestoneDate(milestone.updatedAt ?? milestone.createdAt);
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
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F]">
        Content Requirements
      </h4>

      <ul className="mt-3 space-y-2 pl-5 text-sm leading-5 text-[#355B25]">
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
    <div className="mt-4">
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F]">
        Promotion Goal
      </h4>

      <p className="mt-3 text-sm leading-6 text-[#355B25]">
        {String(goal ?? "").trim() || "No promotion goal provided"}
      </p>
    </div>
  );
}

export function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <div className="rounded-[12px] border border-[#5D7F43] bg-transparent px-3 py-3 sm:rounded-[14px] sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium leading-none text-[#355B25]">
          {label}
        </span>

        {icon ? (
          <span className="shrink-0 text-[#4C5138] [&_svg]:h-4 [&_svg]:w-4">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-base font-semibold leading-none text-[#2E5B1F]">
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
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F]">
        Milestone Target
      </h4>

      <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3">
        <MetricCard
          label="Reach"
          value={milestone.expectedReach}
          icon={<Eye />}
        />
        <MetricCard
          label="Views"
          value={milestone.expectedViews}
          icon={<Play className="fill-current" />}
        />
        <MetricCard
          label="Reaction"
          value={milestone.expectedLikes}
          icon={<Heart className="fill-current" />}
        />
        <MetricCard
          label="Comment"
          value={milestone.expectedComments}
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
      <h4 className="text-sm font-semibold leading-none text-[#2E5B1F]">
        Promotion Target
      </h4>

      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium leading-none text-[#355B25]">
          {toTitleCase(platform)}
        </p>

        <p className="text-sm font-medium leading-none text-[#355B25]">
          {label || "Reach"}
        </p>

        <p className="text-base font-semibold leading-none text-[#2E5B1F]">
          {formatCompactValue(value)}
        </p>
      </div>
    </div>
  );
}

export function MilestoneActions({
  milestone,
}: ActionButtonsProps) {
  return (
    <MilestoneReportActions
      milestoneId={milestone.id}
      milestoneStatus={milestone.status}
    />
  );
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
      <p
        className={["text-xs font-medium sm:text-sm", statusClasses.soft].join(
          " ",
        )}
      >
        Status
      </p>

      <span
        className={[
          "mt-3 inline-flex min-h-[30px] max-w-full items-center justify-center rounded-full px-4 text-base font-semibold leading-none sm:min-h-[36px] sm:px-5",
          statusClasses.badge,
        ].join(" ")}
      >
        <span className="truncate">{label}</span>
      </span>

      <p
        className={[
          "mt-3 flex items-center gap-1.5 text-xs font-medium",
          statusClasses.soft,
        ].join(" ")}
      >
        <CircleDot className="h-3.5 w-3.5 fill-current" />
        {statusDate || "—"}
      </p>
    </div>
  );
}
