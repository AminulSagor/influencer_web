"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import ProfileCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/profile-card";
import ProfileCompletionPercentCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/profile-completion-percent-card";
import VerificationInProgress from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/verification-in-progress";
import VerificationStatusCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/veriication-status-card";
import { EmailVerificationDialog } from "@/components/email-verification-dialog";

import { useProfileStore } from "@/store/client-profile-store";
import {
  requestClientEmailOtp,
  verifyClientEmailOtp,
} from "@/service/client/profile/email-verification";

export type VerificationStatus =
  | "verified"
  | "underReview"
  | "rejected"
  | "unverified";

export interface VerificationStepType {
  id: number;
  title: string;
  status: VerificationStatus;
}

const getDocStatus = (
  status?: string | null,
  hasValue?: boolean,
): VerificationStatus => {
  if (status === "approved") return "verified";
  if (status === "pending") return "underReview";
  if (status === "rejected") return "rejected";
  if (hasValue) return "underReview";
  return "unverified";
};

const VarificationCheckListPage = () => {
  const t = useTranslations("brand.verificationChecklist");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const verificationStep = useMemo<VerificationStepType[]>(() => {
    if (!profile) {
      return [
        { id: 1, title: t("socialProfileVerification"), status: "unverified" },
        { id: 2, title: t("phoneVerification"), status: "unverified" },
        { id: 3, title: t("paymentSetup"), status: "unverified" },
        { id: 4, title: t("nid"), status: "unverified" },
        { id: 5, title: t("tradeLicense"), status: "unverified" },
        { id: 6, title: t("tin"), status: "unverified" },
        { id: 7, title: t("bin"), status: "unverified" },
        { id: 8, title: t("email"), status: "unverified" },
      ];
    }

    const hasSocialLinks =
      Array.isArray(profile.socialLinks) && profile.socialLinks.length > 0;

    const hasPaymentSetup = Boolean(profile.phone?.trim());

    const hasNid =
      Boolean(profile.nidNumber?.trim()) ||
      Boolean(profile.nidFrontImg?.trim()) ||
      Boolean(profile.nidBackImg?.trim());

    const hasTradeLicense =
      Boolean(profile.tradeLicenseNumber?.trim()) ||
      Boolean(profile.tradeLicenseImg?.trim());

    const hasTin =
      Boolean(profile.tinNumber?.trim()) || Boolean(profile.tinImage?.trim());

    const hasBin = Boolean(profile.binNumber?.trim());

    return [
      {
        id: 1,
        title: t("socialProfileVerification"),
        status: hasSocialLinks ? "verified" : "unverified",
      },
      {
        id: 2,
        title: t("phoneVerification"),
        status: profile.isPhoneVerified ? "verified" : "unverified",
      },
      {
        id: 3,
        title: t("paymentSetup"),
        status: hasPaymentSetup ? "verified" : "unverified",
      },
      {
        id: 4,
        title: t("nid"),
        status: getDocStatus(profile.nidVerification?.nidStatus, hasNid),
      },
      {
        id: 5,
        title: t("tradeLicense"),
        status: getDocStatus(
          profile.tradeLicenseVerification?.tradeLicenseStatus,
          hasTradeLicense,
        ),
      },
      {
        id: 6,
        title: t("tin"),
        status: getDocStatus(profile.tinVerification?.tinStatus, hasTin),
      },
      {
        id: 7,
        title: t("bin"),
        status: getDocStatus(profile.binVerification?.binStatus, hasBin),
      },
      {
        id: 8,
        title: t("email"),
        status: profile.isEmailVerified ? "verified" : "unverified",
      },
    ];
  }, [profile, t]);

  const handleVerificationStepClick = async (item: VerificationStepType) => {
    if (item.id !== 8) return;

    if (profile?.isEmailVerified) {
      toast.success("Email already verified");
      return;
    }

    try {
      await requestClientEmailOtp();
      toast.success("Verification code sent to your email");
      setEmailDialogOpen(true);
    } catch {
      toast.error("Failed to send verification code");
    }
  };

  const completedCount = verificationStep.filter(
    (item) => item.status === "verified",
  ).length;

  const completionPercent = Math.round(
    (completedCount / verificationStep.length) * 100,
  );

  const hasUnderReview = verificationStep.some(
    (item) => item.status === "underReview",
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="lg:w-2/3">
          <ProfileCard />
        </div>
        <div className="lg:w-1/3">
          <VerificationInProgress hasUnderReview={hasUnderReview} />
        </div>
      </div>

      <ProfileCompletionPercentCard percentage={completionPercent} />

      <div className="space-y-2">
        {verificationStep.map((item) => (
          <VerificationStatusCard
            key={item.id}
            item={item}
            onClick={
              item.id === 8 && item.status === "unverified"
                ? () => handleVerificationStepClick(item)
                : undefined
            }
          />
        ))}
      </div>

      <EmailVerificationDialog
        open={emailDialogOpen}
        email={profile?.email ?? ""}
        onOpenChange={setEmailDialogOpen}
        verifyOtp={verifyClientEmailOtp}
        onVerified={() =>
          setProfile(
            profile
              ? {
                  ...profile,
                  isEmailVerified: true,
                }
              : profile,
          )
        }
      />
    </div>
  );
};

export default VarificationCheckListPage;
