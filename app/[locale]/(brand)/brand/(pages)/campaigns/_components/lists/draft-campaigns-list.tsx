"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaClock } from "react-icons/fa";
import { AlertTriangle, Trash2 } from "lucide-react";
import ListShell from "../list-shell";

import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { getPlatformIcon } from "@/utils/platforms_util";
import { formatDeadline } from "@/utils/date_util";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { deleteCampaign } from "@/service/campaign/delete-campaign";
import { notifyError, notifySuccess } from "@/utils/toast_util";

export default function DraftCampaignsList({
  campaigns,
  loading,
  onCampaignDeleted,
}: {
  campaigns: CampaignOverView[];
  loading?: boolean;
  onCampaignDeleted?: () => void;
}) {
  const t = useTranslations("brand.CampaignsPage");

  return (
    <ListShell
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyTitle={t("noDraftCampaignsFound")}
    >
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {campaigns.map((c) => (
          <div key={c.id}>
            <DraftCard c={c} onCampaignDeleted={onCampaignDeleted} />
          </div>
        ))}
      </div>
    </ListShell>
  );
}

function DraftCard({
  c,
  onCampaignDeleted,
}: {
  c: CampaignOverView;
  onCampaignDeleted?: () => void;
}) {
  const t = useTranslations("brand.CampaignsPage");
  const router = useRouter();
  const setStep = useCampaignStore((state) => state.setStep);
  const setCampaignId = useCampaignStore((state) => state.setCampaignId);
  const setCampaignType = useCampaignStore((state) => state.setCampaignType);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const campaignType =
    c.campaignType === "paid_ad" ? t("paidAd") : t("influencerPromotion");

  const isPaidAd = c.campaignType === "paid_ad";
  const isInfluencerCampaign = c.campaignType === "influencer_promotion";
  const isAssigned = (c.assignedTo?.length ?? 0) > 0;

  const assignmentText = (() => {
    if (isPaidAd) {
      return isAssigned ? t("agencyAssigned") : t("noAgencyAssigned");
    }

    if (isInfluencerCampaign) {
      return isAssigned ? t("influencerAssigned") : t("noInfluencersAssigned");
    }

    return "";
  })();

  const handleContinueEditing = () => {
    setCampaignId(c.id);
    setCampaignType(c.campaignType);
    setStep(2);

    router.push(`/brand/create-campaign?draftId=${c.id}&step=2`);
  };

  const handleDeleteCampaign = async () => {
    try {
      setDeleting(true);
      const response = await deleteCampaign(c.id);

      if (!response.success) {
        notifyError(response.message || "Failed to delete campaign");
        return;
      }

      notifySuccess(response.message || "Campaign deleted successfully");
      setConfirmDeleteOpen(false);
      onCampaignDeleted?.();
    } catch (error: any) {
      notifyError(error?.message || "Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="py-8">
        <CardContent className="space-y-4 lg:px-3 xl:px-6">
          <div className="space-y-1">
            <h3 className="text-Primary text-lg font-semibold leading-tight">
              {c.campaignName}
            </h3>
            <p className="text-dark-gray text-sm">{campaignType}</p>
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <AvatarStack users={c.assignedTo} />
            {assignmentText}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">{t("platforms")}</p>
            <div className="flex items-center gap-2">
              {c.platforms.length ? (
                c.platforms.map((p) => (
                  <span
                    key={p}
                    className="bg-light-green leading-none rounded-md p-1.5"
                  >
                    {getPlatformIcon(p, "h-4 w-4 text-white")}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">
                  {t("noPlatformsAdded")}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2 rounded-xl border bg-muted/40 px-4 py-5">
            <p className="text-Primary">{t("offered")}</p>
            <p className="text-light-green text-3xl font-semibold">
              {c.totalBudget > 0 ? c.totalBudget : t("none")}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-orange flex items-center gap-2 text-sm">
              <FaClock className="text-orange" />
              {t("deadline")}
            </p>
            <p className="text-orange text-sm">{formatDeadline(c.deadline)}</p>
          </div>

          <SecondaryButton
            className="text-Primary w-full px-2 py-2"
            onClick={handleContinueEditing}
          >
            {t("continueEditingCampaignDetails")}
          </SecondaryButton>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-2 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => setConfirmDeleteOpen(true)}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete Campaign"}
          </button>
        </CardContent>
      </Card>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl border-red-100 p-0" showCloseButton={!deleting}>
          <div className="space-y-5 p-6">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                  <AlertTriangle className="h-6 w-6" />
                </span>
                <div>
                  <DialogTitle className="text-xl font-bold text-red-600">
                    Delete Campaign
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-red-500">
                    This draft campaign will be permanently deleted and cannot be restored.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              Are you sure you want to delete <strong>{c.campaignName}</strong>?
            </div>

            <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:justify-stretch">
              <button
                type="button"
                className="rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleDeleteCampaign}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
