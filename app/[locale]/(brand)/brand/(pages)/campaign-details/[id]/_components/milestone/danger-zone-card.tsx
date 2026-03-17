"use client";

import React from "react";
import { ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitCampaignCancelRequest } from "@/service/client/campaigns/campaign-danger-zone";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type DangerZoneCardProps = {
  campaignId: string;
  targetType: "agency" | "influencer";
  agencyOfferId?: string | null;
  assignmentId?: string;
  onSubmitted?: () => void;
};

export default function DangerZoneCard({
  campaignId,
  targetType,
  agencyOfferId,
  assignmentId,
  onSubmitted,
}: DangerZoneCardProps) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const trimmedReason = reason.trim();

  const isDisabled = React.useMemo(() => {
    if (!trimmedReason) return true;

    if (targetType === "agency") {
      return !agencyOfferId;
    }

    return !assignmentId;
  }, [trimmedReason, targetType, agencyOfferId, assignmentId]);

  const handleSubmit = async () => {
    if (!trimmedReason) {
      notifyError("Please write a reason");
      return;
    }

    try {
      setIsSubmitting(true);

      if (targetType === "agency") {
        if (!agencyOfferId) {
          notifyError("Agency offer id is missing");
          return;
        }

        await submitCampaignCancelRequest(campaignId, {
          targetType: "agency",
          agencyOfferId,
          reason: trimmedReason,
        });
      } else {
        if (!assignmentId) {
          notifyError("Assignment id is missing");
          return;
        }

        await submitCampaignCancelRequest(campaignId, {
          targetType: "influencer",
          assignmentId,
          reason: trimmedReason,
        });
      }

      notifySuccess("Cancellation request submitted successfully");
      setReason("");
      setOpen(false);
      onSubmitted?.();
    } catch (error) {
      notifyError("Failed to submit cancellation request");
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
            <p className="text-sm font-semibold text-red-600">Danger Zone</p>
            <p className="text-[11px] text-red-500">Cancel Campaign</p>
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
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border-red-200 bg-white"
            placeholder="Write your reason..."
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
                Submitting...
              </span>
            ) : (
              "Request Cancellation & Submit Reason"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
