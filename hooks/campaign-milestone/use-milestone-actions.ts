import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { safeStr } from "@/utils/admin/campaign/number_util";
import { payInfluencerSubmission } from "@/service/admin/campaign/pay-influencer-submission";
import { updateInfluencerMilestoneStatus } from "@/service/admin/campaign/update-influencer-milestone-status";
import { payAgencySubmission } from "@/service/admin/campaign/agency/pay-agency-submission";
import { reviewAgencySubmission } from "@/service/admin/campaign/agency/review-agency-submission";
import type { SubmissionItem } from "@/utils/admin/campaign/campaign-milestone/submission_helpers";

export function useMilestoneActions(
  isPaidAd: boolean,
  activeMilestone: any | null,
  activeMilestoneIdSafe: string,
  refreshMilestoneSubmissions: (milestoneId: string) => Promise<void>
) {
  const [paymentActionMap, setPaymentActionMap] = useState<Record<string, string>>({});
  const [approveOpen, setApproveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [partialPaidOpen, setPartialPaidOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [partialReason, setPartialReason] = useState("");
  const [partialAmount, setPartialAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSubmission, setActionSubmission] = useState<SubmissionItem | null>(null);

  useEffect(() => {
    setPaymentActionMap({});
    setApproveOpen(false);
    setDeclineOpen(false);
    setPartialPaidOpen(false);
    setDeclineReason("");
    setPartialReason("");
    setPartialAmount("");
    setActionSubmission(null);
  }, [activeMilestoneIdSafe]);

  const getSubmissionRequestedAmount = useCallback((submission: SubmissionItem | null) => {
    return Number(submission?.requestedAmount ?? 0);
  }, []);

  const getSubmissionPaidAmount = useCallback((submission: SubmissionItem | null) => {
    return Number(submission?.paidAmount ?? 0);
  }, []);

  const getSubmissionRemainingAmount = useCallback((submission: SubmissionItem | null) => {
    const requestedAmount = getSubmissionRequestedAmount(submission);
    const paidAmount = getSubmissionPaidAmount(submission);
    return Math.max(0, requestedAmount - paidAmount);
  }, [getSubmissionPaidAmount, getSubmissionRequestedAmount]);

  const openApproveForSubmission = useCallback((submission: SubmissionItem) => {
    setActionSubmission(submission);
    setApproveOpen(true);
  }, []);

  const openDeclineForSubmission = useCallback((submission: SubmissionItem) => {
    setActionSubmission(submission);
    setDeclineOpen(true);
  }, []);

  const openPayForSubmission = useCallback(
    (submission: SubmissionItem) => {
      const selectedPaymentAction = paymentActionMap[submission.id] || "";
      if (!selectedPaymentAction) {
        toast.error("Select a payment type first.");
        return;
      }

      setActionSubmission(submission);

      if (selectedPaymentAction === "partial_paid") {
        setPartialPaidOpen(true);
        return;
      }

      void (async () => {
        try {
          setActionLoading(true);

          const payableAmount =
            getSubmissionRemainingAmount(submission) > 0
              ? getSubmissionRemainingAmount(submission)
              : getSubmissionRequestedAmount(submission);

          if (isPaidAd) {
            await payAgencySubmission({
              submissionId: submission.id,
              amount: payableAmount,
            });
          } else {
            await payInfluencerSubmission({
              submissionId: submission.id,
              amount: payableAmount,
              reason: "Full payment completed",
            });
          }

          toast.success("Payment completed successfully.");
          setPaymentActionMap((prev) => ({ ...prev, [submission.id]: "" }));
          await refreshMilestoneSubmissions(activeMilestoneIdSafe);
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Failed to complete payment."
          );
        } finally {
          setActionLoading(false);
        }
      })();
    },
    [
      activeMilestoneIdSafe,
      getSubmissionRemainingAmount,
      getSubmissionRequestedAmount,
      isPaidAd,
      paymentActionMap,
      refreshMilestoneSubmissions,
    ]
  );

  async function handleApproveConfirm() {
    if (!actionSubmission?.id) {
      toast.error("Submission id is missing.");
      return;
    }

    try {
      setActionLoading(true);

      if (isPaidAd) {
        await reviewAgencySubmission({
          submissionId: actionSubmission.id,
          action: "approve",
        });
      } else {
        const milestoneId = safeStr((activeMilestone as any)?.id);
        const assignmentId =
          safeStr(actionSubmission?.assignmentId) ||
          safeStr((activeMilestone as any)?.assignmentId);

        if (!milestoneId || !assignmentId) {
          toast.error("Milestone or assignment id is missing.");
          return;
        }

        await updateInfluencerMilestoneStatus({
          milestoneId,
          assignmentId,
          status: "approved",
        });
      }

      toast.success("Submission approved successfully.");
      setApproveOpen(false);
      await refreshMilestoneSubmissions(activeMilestoneIdSafe);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to approve submission."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeclineConfirm() {
    if (!declineReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }

    if (!actionSubmission?.id) {
      toast.error("Submission id is missing.");
      return;
    }

    try {
      setActionLoading(true);

      if (isPaidAd) {
        await reviewAgencySubmission({
          submissionId: actionSubmission.id,
          action: "decline",
          reason: declineReason.trim(),
        });
      } else {
        const milestoneId = safeStr((activeMilestone as any)?.id);
        const assignmentId =
          safeStr(actionSubmission?.assignmentId) ||
          safeStr((activeMilestone as any)?.assignmentId);

        if (!milestoneId || !assignmentId) {
          toast.error("Milestone or assignment id is missing.");
          return;
        }

        await updateInfluencerMilestoneStatus({
          milestoneId,
          assignmentId,
          status: "declined",
          reason: declineReason.trim(),
        });
      }

      toast.success("Submission declined successfully.");
      setDeclineOpen(false);
      setDeclineReason("");
      await refreshMilestoneSubmissions(activeMilestoneIdSafe);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to decline submission."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePartialPaidSubmit() {
    if (!actionSubmission?.id) {
      toast.error("Submission id is missing.");
      return;
    }

    const amountNumber = Number(partialAmount || 0);
    const remainingAmount = getSubmissionRemainingAmount(actionSubmission);

    if (!partialReason.trim()) {
      toast.error("Reason is required.");
      return;
    }

    if (!amountNumber || amountNumber <= 0) {
      toast.error("Enter a valid partial amount.");
      return;
    }

    if (amountNumber > remainingAmount) {
      toast.error("Partial amount cannot be greater than remaining due.");
      return;
    }

    try {
      setActionLoading(true);

      if (isPaidAd) {
        await payAgencySubmission({
          submissionId: actionSubmission.id,
          amount: amountNumber,
          reason: partialReason.trim(),
        });
      } else {
        await payInfluencerSubmission({
          submissionId: actionSubmission.id,
          amount: amountNumber,
          reason: partialReason.trim(),
        });
      }

      toast.success("Partial payment updated successfully.");
      setPartialPaidOpen(false);
      setPartialAmount("");
      setPartialReason("");
      setPaymentActionMap((prev) => ({ ...prev, [actionSubmission.id]: "" }));
      await refreshMilestoneSubmissions(activeMilestoneIdSafe);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update partial payment."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return {
    paymentActionMap,
    setPaymentActionMap,
    approveOpen,
    setApproveOpen,
    declineOpen,
    setDeclineOpen,
    partialPaidOpen,
    setPartialPaidOpen,
    declineReason,
    setDeclineReason,
    partialReason,
    setPartialReason,
    partialAmount,
    setPartialAmount,
    actionLoading,
    actionSubmission,
    getSubmissionRequestedAmount,
    getSubmissionPaidAmount,
    getSubmissionRemainingAmount,
    openApproveForSubmission,
    openDeclineForSubmission,
    openPayForSubmission,
    handleApproveConfirm,
    handleDeclineConfirm,
    handlePartialPaidSubmit,
  };
}
