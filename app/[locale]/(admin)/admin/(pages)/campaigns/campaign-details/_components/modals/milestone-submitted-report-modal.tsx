"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FaFlag } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import {
  getMilestoneReports,
  type MilestoneReport,
} from "@/service/admin/campaign/get-milestone-reports";

type Props = {
  open: boolean;
  onClose: () => void;
  milestoneId: string | null;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
};

export default function MilestoneSubmittedReportModal({
  open,
  onClose,
  milestoneId,
}: Props) {
  const [reports, setReports] = useState<MilestoneReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && milestoneId) {
      setLoading(true);
      setError(null);
      getMilestoneReports(milestoneId)
        .then((res) => {
          if (res.success && res.data) {
            setReports(res.data);
          } else {
            setReports([]);
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load reports");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, milestoneId]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[500px] rounded-[18px] border-0 bg-white p-0 shadow-xl max-h-[85vh] flex flex-col">
        <div className="rounded-[18px] bg-white p-6 flex-1 overflow-y-auto">
          <DialogTitle className="flex items-center gap-2 text-[20px] font-bold text-[#7EA055] mb-6">
            <FaFlag className="text-[#7EA055] text-xl" />
            Submitted Report
          </DialogTitle>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#7EA055]" />
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-medium text-[15px]">
              No reports found
            </div>
          ) : (
            <div className="space-y-5">
              {reports.map((report, index) => (
                <div key={report.id} className="space-y-2">
                  <div className="flex items-center justify-between rounded-[12px] bg-[#F4F6ED] px-4 py-3">
                    <span className="font-bold text-[#1E3A20] text-[15px]">
                      Report {reports.length > 1 ? index + 1 : ""}
                    </span>
                    <span className="text-[#3E5C23] text-[14px] font-medium">
                      {formatDate(report.date)}
                    </span>
                  </div>
                  <div className="rounded-[12px] border border-[#C5D6AB] px-5 py-4 text-[#2C3E1F] text-[15px] leading-relaxed">
                    {report.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
