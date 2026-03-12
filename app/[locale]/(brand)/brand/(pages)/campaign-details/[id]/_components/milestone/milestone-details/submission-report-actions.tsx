"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import ReportAdminDialog from "./report-admin-dialog";
import SubmittedReportsDialog from "./submitted-reports-dialog";
import { SubmissionStatus } from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  submissionId: string;
  status: SubmissionStatus | string;
};

function normalizeStatus(value?: string) {
  return String(value ?? "").trim().toLowerCase();
}

function canReportAdmin(status?: string) {
  const value = normalizeStatus(status);
  return !["completed", "approved"].includes(value);
}

export default function SubmissionReportActions({
  submissionId,
  status,
}: Props) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportsOpen, setReportsOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const reportEnabled = canReportAdmin(status);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          onClick={() => setReportOpen(true)}
          disabled={!reportEnabled}
          className="h-10 rounded-xl bg-[#6D8F47] px-4 text-xs font-medium text-white hover:bg-[#628141] disabled:bg-[#F1F1F1] disabled:text-[#BDBDBD] sm:text-sm"
        >
          Report Admin
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setReportsOpen(true)}
          className="h-10 rounded-xl border border-[#D5D5D5] bg-[#FAFAFA] px-4 text-xs font-medium text-[#2E5B1F] hover:bg-[#FAFAFA] sm:text-sm"
        >
          View Submitted Report
        </Button>
      </div>

      <ReportAdminDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        submissionId={submissionId}
        onSubmitted={() => setRefreshKey((prev) => prev + 1)}
      />

      <SubmittedReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
        submissionId={submissionId}
        refreshKey={refreshKey}
      />
    </>
  );
}