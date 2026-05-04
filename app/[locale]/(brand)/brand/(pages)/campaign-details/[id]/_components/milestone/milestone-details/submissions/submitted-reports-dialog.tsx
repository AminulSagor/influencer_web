"use client";

import * as React from "react";
import { Flag } from "lucide-react";
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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours = date.getHours();
  const displayHour = hours % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${displayHour}:${minutes} ${period}`;
}

function getReportDate(item: SubmissionReportItem) {
  return item.date ?? item.createdAt;
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

    void load();

    return () => {
      active = false;
    };
  }, [open, milestoneId, refreshKey]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[calc(100vw-32px)] max-w-[527px] gap-0 rounded-[14px] border border-[#9AB279] bg-white p-0 shadow-xl sm:max-w-[527px]">
        <DialogHeader className="px-7 pb-4 pt-7">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-[#6F9655]">
            <Flag className="h-8 w-8 fill-[#6F9655] text-[#6F9655]" />
            Submitted Report
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-7 pb-8 pr-5">
          {isLoading ? (
            <div className="rounded-[12px] border border-[#9AB279] bg-white p-4 text-sm text-[#355B25]">
              Loading report...
            </div>
          ) : error ? (
            <div className="rounded-[12px] border border-[#FF1616] bg-[#FFF8F8] p-4 text-sm text-[#FF1616]">
              {error}
            </div>
          ) : !items.length ? (
            <div className="rounded-[12px] border border-[#9AB279] bg-white p-4 text-sm text-[#355B25]">
              No report found.
            </div>
          ) : (
            <div className="space-y-6 pr-2">
              {items.map((item, index) => (
                <article key={item.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-[10px] bg-[#F4F6DC] px-5 py-3 text-[#28521F]">
                    <h4 className="text-lg font-semibold leading-none">
                      Report {index + 1}
                    </h4>
                    <p className="text-base font-medium leading-none">
                      {formatReportDate(getReportDate(item))}
                    </p>
                  </div>

                  <div className="min-h-[86px] rounded-[14px] border border-[#9AB279] bg-white px-4 py-3 text-base leading-7 text-black">
                    {item.content?.trim() || "No report content."}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
