import { useEffect, useMemo, useState } from "react";
import { getInfluencerMilstoneProgress } from "@/service/admin/campaign/get-milstone-progress";
import {
  isCompletedStatus,
  extractProgressPercent,
} from "@/utils/admin/campaign/campaign-milestone/submission_helpers";

export function useMilestoneProgress(
  campaignId: string,
  selectedInfluencerId: string,
  isActiveInfluencerMode: boolean,
  visibleMilestones: any[]
) {
  const [remoteProgress, setRemoteProgress] = useState<number | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const localProgress = useMemo(() => {
    const total = visibleMilestones.length;
    if (total === 0) return 0;

    const completed = visibleMilestones.filter((m: any) =>
      isCompletedStatus(m?.status)
    ).length;

    return Math.round((completed / total) * 100);
  }, [visibleMilestones]);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!isActiveInfluencerMode || !campaignId || !selectedInfluencerId) {
        setRemoteProgress(null);
        return;
      }

      try {
        setProgressLoading(true);
        const res = await getInfluencerMilstoneProgress(
          campaignId,
          selectedInfluencerId
        );
        if (cancelled) return;
        setRemoteProgress(extractProgressPercent(res));
      } catch {
        if (cancelled) return;
        setRemoteProgress(null);
      } finally {
        if (!cancelled) setProgressLoading(false);
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [campaignId, selectedInfluencerId, isActiveInfluencerMode]);

  const progress = remoteProgress ?? localProgress;

  return {
    progress,
    progressLoading,
  };
}
