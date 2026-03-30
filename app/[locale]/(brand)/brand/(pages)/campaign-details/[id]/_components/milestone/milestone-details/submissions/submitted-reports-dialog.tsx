"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getMilestoneReports,
  SubmissionReportItem,
} from "@/service/client/campaigns/submission-report.service";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string;
  refreshKey?: number;
};

function formatReportDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SubmittedReportsDialog({
  open,
  onOpenChange,
  milestoneId,
  refreshKey,
}: Props) {
  const [items, setItems] = React.useState<SubmissionReportItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !milestoneId) return;

    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getMilestoneReports(milestoneId);

        if (!active) return;

        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!active) return;

        const message =
          err instanceof Error ? err.message : "Failed to load reports.";
        setError(message);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [open, milestoneId, refreshKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[760px] rounded-2xl border border-[#DADADA] bg-white p-0 shadow-xl">
        <DialogHeader className="border-b border-[#E9E9E9] px-5 py-4 sm:px-6">
          <DialogTitle className="text-base font-semibold text-[#2E5B1F] sm:text-lg">
            Submitted Report
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {isLoading ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-sm text-muted-foreground">
              Loading report...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-500">
              {error}
            </div>
          ) : !items.length ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-sm text-muted-foreground">
              No report found.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#D8D8D8] bg-white p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#2E5B1F] sm:text-base">
                        Submitted Report
                      </h4>
                      <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">
                        {formatReportDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="inline-flex w-fit rounded-full bg-[#EEF5E7] px-3 py-1 text-[11px] font-medium capitalize text-[#5B7B3A] sm:text-xs">
                      {item.authorRole || "client"}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#355B25]">
                    {item.content?.trim() || "No report content."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
