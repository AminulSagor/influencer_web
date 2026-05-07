"use client";

import React from "react";
import { ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitCampaignCancelRequest } from "@/service/client/campaigns/campaign-danger-zone";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import type { CampaignAssignedInfluencer } from "@/types/client/campaigns/campaign-submission.types";
import InfluencerSelector from "./milestone-overview/influencer-selector";
import type { InfluencerOption } from "./milestone-overview/campaign-milestones-overview";

type DangerZoneCardProps = {
  campaignId: string;
  targetType: "agency" | "influencer";
  agencyOfferId?: string | null;
  assignmentId?: string;
  assignedInfluencers?: CampaignAssignedInfluencer[];
  selectedInfluencerId?: string;
  onSelectInfluencer?: (influencerId: string) => void;
  onSubmitted?: () => void;
};

const isDeclinedInfluencer = (status?: string | null) => {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  return ["decline", "declined", "rejected", "reject"].includes(value);
};

export default function DangerZoneCard({
  campaignId,
  targetType,
  agencyOfferId,
  assignmentId,
  assignedInfluencers = [],
  selectedInfluencerId = "",
  onSelectInfluencer,
  onSubmitted,
}: DangerZoneCardProps) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isInfluencerDropdownOpen, setIsInfluencerDropdownOpen] =
    React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const trimmedReason = reason.trim();

  const influencerOptions = React.useMemo<InfluencerOption[]>(
    () =>
      assignedInfluencers.map((item) => ({
        id: item.influencerId,
        name: item.name,
        image: item.image ?? null,
        status: item.status ?? null,
        disabled: isDeclinedInfluencer(item.status),
      })),
    [assignedInfluencers],
  );

  const effectiveSelectedInfluencerId = React.useMemo(() => {
    if (targetType !== "influencer") return "";

    if (
      selectedInfluencerId &&
      influencerOptions.some(
        (item) => item.id === selectedInfluencerId && !item.disabled,
      )
    ) {
      return selectedInfluencerId;
    }

    return influencerOptions.find((item) => !item.disabled)?.id ?? "";
  }, [targetType, selectedInfluencerId, influencerOptions]);

  const selectedInfluencer = React.useMemo(
    () =>
      influencerOptions.find((item) => item.id === effectiveSelectedInfluencerId) ??
      null,
    [influencerOptions, effectiveSelectedInfluencerId],
  );

  React.useEffect(() => {
    if (targetType !== "influencer") return;
    if (!effectiveSelectedInfluencerId) return;
    if (effectiveSelectedInfluencerId === selectedInfluencerId) return;

    onSelectInfluencer?.(effectiveSelectedInfluencerId);
  }, [
    targetType,
    effectiveSelectedInfluencerId,
    selectedInfluencerId,
    onSelectInfluencer,
  ]);

  React.useEffect(() => {
    if (!isInfluencerDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsInfluencerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isInfluencerDropdownOpen]);

  const handleInfluencerSelect = (influencerId: string) => {
    const influencer = influencerOptions.find((item) => item.id === influencerId);
    if (influencer?.disabled) return;

    onSelectInfluencer?.(influencerId);
    setIsInfluencerDropdownOpen(false);
  };

  const isDisabled = React.useMemo(() => {
    if (!trimmedReason) return true;

    if (targetType === "agency") {
      return !agencyOfferId;
    }

    return !assignmentId;
  }, [trimmedReason, targetType, agencyOfferId, assignmentId]);

  const handleSubmit = async () => {
    if (!trimmedReason) {
      notifyError(t("pleaseWriteAReason"));
      return;
    }

    try {
      setIsSubmitting(true);

      if (targetType === "agency") {
        if (!agencyOfferId) {
          notifyError(t("agencyOfferIdIsMissing"));
          return;
        }

        await submitCampaignCancelRequest(campaignId, {
          targetType: "agency",
          agencyOfferId,
          reason: trimmedReason,
        });
      } else {
        if (!assignmentId) {
          notifyError(t("assignmentIdIsMissing"));
          return;
        }

        await submitCampaignCancelRequest(campaignId, {
          targetType: "influencer",
          targetId: assignmentId,
          reason: trimmedReason,
        });
      }

      notifySuccess(t("cancellationRequestSubmittedSuccessfully"));
      setReason("");
      setOpen(false);
      onSubmitted?.();
    } catch (error) {
      notifyError(t("failedToSubmitCancellationRequest"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">
            <X className="h-4 w-4" />
          </span>

          <div className="text-left">
            <p className="text-sm font-semibold text-red-600">
              {t("dangerZone")}
            </p>
            <p className="text-[11px] text-red-500">{t("cancelCampaign")}</p>
          </div>
        </div>

        {open ? (
          <ChevronUp className="h-4 w-4 text-red-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-red-600" />
        )}
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4">
          {targetType === "influencer" && influencerOptions.length > 0 ? (
            <div ref={dropdownRef}>
              <p className="mb-1 text-xs font-medium text-red-600">
                Select influencer
              </p>
              <InfluencerSelector
                influencerOptions={influencerOptions}
                selectedInfluencer={selectedInfluencer}
                selectedInfluencerId={effectiveSelectedInfluencerId}
                isOpen={isInfluencerDropdownOpen}
                onToggle={() => setIsInfluencerDropdownOpen((prev) => !prev)}
                onSelect={handleInfluencerSelect}
              />
            </div>
          ) : null}

          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border-red-200 bg-white"
            placeholder={t("writeYourReason")}
          />

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled || isSubmitting}
            className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("submitting")}
              </span>
            ) : (
              t("requestCancellationAndSubmitReason")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
