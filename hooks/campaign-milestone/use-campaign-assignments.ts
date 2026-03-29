import { useEffect, useState } from "react";
import { getCampaignAssignments } from "@/service/admin/campaign/get-campaign-assignments";
import { safeStr } from "@/utils/admin/campaign/number_util";

export function useCampaignAssignments(
  campaignId: string,
  isEditableAssignmentMode: boolean
) {
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentRows, setAssignmentRows] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener("influencer-assigned", handler);
    return () => window.removeEventListener("influencer-assigned", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      if (!isEditableAssignmentMode || !campaignId) {
        setAssignmentRows([]);
        return;
      }

      try {
        setAssignmentsLoading(true);
        const res = await getCampaignAssignments(campaignId);
        if (cancelled) return;

        const rows = Array.isArray(res?.data?.assignments)
          ? res.data.assignments
          : [];

        setAssignmentRows(rows);
      } catch {
        if (!cancelled) setAssignmentRows([]);
      } finally {
        if (!cancelled) setAssignmentsLoading(false);
      }
    };

    loadAssignments();

    return () => {
      cancelled = true;
    };
  }, [campaignId, isEditableAssignmentMode, refreshTrigger]);

  return {
    assignmentsLoading,
    assignmentRows,
    setAssignmentRows,
  };
}
