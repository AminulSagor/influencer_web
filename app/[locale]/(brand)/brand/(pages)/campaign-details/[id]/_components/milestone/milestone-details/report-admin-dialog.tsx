"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createSubmissionReport } from "@/service/client/campaigns/submission-report.service";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string;
  onSubmitted?: () => void;
};

function resolveTargetTypeFromPath() {
  if (typeof window === "undefined") return "agency";

  const path = window.location.pathname.toLowerCase();

  if (path.includes("/influencer/")) return "influencer";
  return "agency";
}

export default function ReportAdminDialog({
  open,
  onOpenChange,
  milestoneId,
  onSubmitted,
}: Props) {
  const [report, setReport] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setReport("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    const value = report.trim();

    if (!value) {
      setError("Please write your report.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const targetType = resolveTargetTypeFromPath();

      await createSubmissionReport(milestoneId, targetType, { report: value });

      onSubmitted?.();
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit report.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-2xl border border-[#DADADA] bg-white p-0 shadow-xl">
        <DialogHeader className="border-b border-[#E9E9E9] px-5 py-4 sm:px-6">
          <DialogTitle className="text-base font-semibold text-[#2E5B1F] sm:text-lg">
            Report to Admin
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#355B25]">
              Write Report
            </label>

            <Textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Write your report here"
              className="min-h-[160px] resize-none rounded-2xl border-[#D8D8D8] bg-white text-sm text-[#355B25] placeholder:text-[#A0A0A0] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
        </div>

        <DialogFooter className="border-t border-[#E9E9E9] px-5 py-4 sm:px-6">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !report.trim()}
              className="h-10 rounded-xl bg-[#6D8F47] px-5 text-sm font-medium text-white hover:bg-[#628141] disabled:bg-[#D8D8D8] disabled:text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
