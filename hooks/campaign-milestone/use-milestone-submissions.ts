import { useCallback, useEffect, useMemo, useState } from "react";
import { safeStr } from "@/utils/admin/campaign/number_util";
import { getMilestoneSubmissions } from "@/service/admin/campaign/get-milestone-submissions";
import {
  deriveAggregateMilestoneStatus,
  type SubmissionItem,
  type MilestoneSubmissionBucket,
} from "@/utils/admin/campaign/campaign-milestone/submission_helpers";

export function useMilestoneSubmissions(baseVisibleMilestones: any[]) {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [milestoneSubmissionMap, setMilestoneSubmissionMap] = useState<
    Record<string, MilestoneSubmissionBucket>
  >({});

  const refreshMilestoneSubmissions = useCallback(
    async (milestoneId: string) => {
      const normalizedMilestoneId = safeStr(milestoneId);
      if (!normalizedMilestoneId) return;

      const res = await getMilestoneSubmissions(normalizedMilestoneId);
      const data = res?.data ?? {};
      const submissions = Array.isArray(data?.submissions) ? data.submissions : [];

      setMilestoneSubmissionMap((prev) => ({
        ...prev,
        [normalizedMilestoneId]: {
          totalSubmissions: Number(data?.totalSubmissions ?? submissions.length ?? 0),
          submissions,
        },
      }));
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const loadVisibleMilestoneSubmissions = async () => {
      const milestoneIds = baseVisibleMilestones
        .map((item: any) => safeStr(item?.id || item?.masterMilestoneId))
        .filter(Boolean);

      if (milestoneIds.length === 0) {
        setMilestoneSubmissionMap({});
        return;
      }

      try {
        setSubmissionLoading(true);

        const responses = await Promise.all(
          milestoneIds.map(async (milestoneId: string) => {
            try {
              const res = await getMilestoneSubmissions(milestoneId);
              const data = res?.data ?? {};
              const submissions = Array.isArray(data?.submissions)
                ? data.submissions
                : [];

              return {
                milestoneId,
                value: {
                  totalSubmissions: Number(
                    data?.totalSubmissions ?? submissions.length ?? 0
                  ),
                  submissions,
                },
              };
            } catch {
              return {
                milestoneId,
                value: {
                  totalSubmissions: 0,
                  submissions: [],
                },
              };
            }
          })
        );

        if (cancelled) return;

        const nextMap = responses.reduce<
          Record<string, MilestoneSubmissionBucket>
        >((acc, item) => {
          acc[item.milestoneId] = item.value;
          return acc;
        }, {});

        setMilestoneSubmissionMap(nextMap);
      } finally {
        if (!cancelled) setSubmissionLoading(false);
      }
    };

    loadVisibleMilestoneSubmissions();

    return () => {
      cancelled = true;
    };
  }, [baseVisibleMilestones]);

  const visibleMilestones = useMemo(() => {
    return baseVisibleMilestones.map((milestone: any) => {
      const milestoneId = safeStr(milestone?.id || milestone?.masterMilestoneId);
      const bucket = milestoneSubmissionMap[milestoneId];

      if (!bucket) return milestone;

      return {
        ...milestone,
        status: deriveAggregateMilestoneStatus(bucket.submissions, milestone?.status),
      };
    });
  }, [baseVisibleMilestones, milestoneSubmissionMap]);

  const getActiveSubmissions = useCallback(
    (activeMilestoneIdSafe: string): SubmissionItem[] => {
      const bucket = milestoneSubmissionMap[activeMilestoneIdSafe] ?? null;
      return Array.isArray(bucket?.submissions) ? bucket.submissions : [];
    },
    [milestoneSubmissionMap]
  );

  return {
    submissionLoading,
    milestoneSubmissionMap,
    visibleMilestones,
    refreshMilestoneSubmissions,
    getActiveSubmissions,
  };
}
