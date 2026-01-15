"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flag } from "lucide-react";

import {
  compact,
  formatDate,
  normalizeKey,
  targetIconMap,
} from "./milestone-ui-helpers";
import { Milestone } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/milestone-details-panel";

/** ✅ Dummy submitted report type */
type SubmittedReport = {
  id: string;
  title: string; // e.g. "Report 1"
  createdAt: string; // ISO or any string
  message: string;
};

/** ✅ Dummy data (replace with API later) */
const dummySubmittedReports: SubmittedReport[] = [
  {
    id: "r1",
    title: "Report 1",
    createdAt: "2025-12-13T00:00:00.000Z",
    message: "The campaign goal didn’t match and wrong logo was used here.",
  },
  {
    id: "r2",
    title: "Report 2",
    createdAt: "2025-12-13T00:00:00.000Z",
    message:
      "The campaign did not achieve the intended goals, as the objectives outlined at the start were not properly followed. Additionally, incorrect logo was used in the promotional materials, which may have caused brand inconsistency and confusion among the audience. Proper attention to campaign guidelines and brand assets is needed for future activities to ensure alignment and effectiveness.",
  },
];

const formatSubmittedDateTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function MilestoneTopRow({
  milestone,
  st,
}: {
  milestone: Milestone;
  st: { badge: string };
}) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const [submittedOpen, setSubmittedOpen] = React.useState(false);

  const canReport = !!milestone.actions?.canReportAdmin;
  const canView = !!milestone.actions?.canViewSubmittedReport;

  const handleSubmitReport = () => {
    // TODO: call API later
    setReportOpen(false);
    setReason("");
  };

  // ✅ For now: you can switch this to API result later
  const submittedReports = dummySubmittedReports;

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border bg-linear-to-r from-light-green/30 to-white rounded-md border-light-green p-4">
      {/* Content req */}
      <div>
        <p className="font-semibold text-Primary">Content Requirements</p>

        <ul className="space-y-1 text-xs text-black/60">
          {(milestone.contentRequirements ?? []).length ? (
            milestone.contentRequirements!.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-light-green" />
                <span className="min-w-0">{r}</span>
              </li>
            ))
          ) : (
            <li>—</li>
          )}
        </ul>
      </div>

      {/* Targets */}
      <div>
        <p className="font-semibold text-Primary text-sm">Milestone Target</p>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {(milestone.milestoneTargets ?? []).map((t) => {
            const Icon = targetIconMap[normalizeKey(t.key)];

            return (
              <div
                key={t.key}
                className="rounded-md border max-w-24 min-w-24 border-light-green px-2 py-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-Primary/90">{t.label}</p>

                  {Icon ? (
                    <Icon className="h-4 w-4 text-Primary/80" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                </div>

                <p className="text-xl font-semibold text-Primary">
                  {compact(t.target)}
                </p>
              </div>
            );
          })}

          {(!milestone.milestoneTargets ||
            milestone.milestoneTargets.length === 0) && (
            <p className="text-Primary">—</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          className="bg-light-green text-white rounded-md text-sm w-full px-4 py-2 hover:bg-[#6a8a4a] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!canReport}
          onClick={() => setReportOpen(true)}
          type="button"
        >
          Report Admin
        </button>

        <button
          className="rounded-md text-sm w-full px-4 py-2 bg-white border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!canView}
          onClick={() => setSubmittedOpen(true)}
          type="button"
        >
          View Submitted Report
        </button>
      </div>

      {/* Status */}
      <div className="border p-4 rounded-lg flex flex-col items-center">
        <p className="text-sm text-black/50">Status</p>

        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className={st.badge}>
            {String(milestone.status)}
          </Badge>
        </div>

        <div className="mt-3 text-xs text-black/50">
          <p className="text-Primary font-semibold">
            {formatDate(milestone.dueDate)}
          </p>
        </div>
      </div>

      {/* ✅ Report Admin Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-[520px] rounded-xl border border-light-green/30 p-0 overflow-hidden">
          <div className="p-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-Primary">
                <Flag className="h-4 w-4 text-light-green" />
                <span className="text-sm font-semibold">Write Report</span>
              </DialogTitle>
            </DialogHeader>

            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write your reasons..."
              className="mt-4 min-h-[120px] resize-none rounded-lg border-light-green/40 focus-visible:ring-light-green"
            />

            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={!reason.trim()}
                className="bg-light-green text-white rounded-md text-sm px-10 py-2 hover:bg-[#6a8a4a] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Submit Report
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Submitted Reports Dialog */}
      <Dialog open={submittedOpen} onOpenChange={setSubmittedOpen}>
        <DialogContent className="sm:max-w-[560px] rounded-xl border border-light-green/30 p-0 overflow-hidden">
          <div className="p-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-Primary">
                <Flag className="h-4 w-4 text-light-green" />
                <span className="text-sm font-semibold">Submitted Report</span>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 max-h-[420px] overflow-auto pr-2 space-y-4">
              {submittedReports.length ? (
                submittedReports.map((r) => (
                  <div key={r.id} className="space-y-2">
                    {/* top row (Report chip + date) */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="bg-light-green/20 text-Primary text-xs font-semibold px-3 py-1 rounded-md">
                        {r.title}
                      </div>

                      <p className="text-xs text-black/50">
                        {formatSubmittedDateTime(r.createdAt)}
                      </p>
                    </div>

                    {/* message box */}
                    <div className="rounded-lg border border-light-green/30 bg-white px-3 py-3 text-sm text-black/70 leading-relaxed">
                      {r.message}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black/50">No submitted reports.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
