"use client";

import React, { useEffect, useMemo } from "react";
import ProfileCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/profile-card";
import ProfileCompletionPercentCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/profile-completion-percent-card";
import VerificationInProgress from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/verification-in-progress";
import VerificationStatusCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/veriication-status-card";
import { useProfileStore } from "@/store/client-profile-store";

export type VerificationStatus =
  | "Verified"
  | "Under Review"
  | "Rejected"
  | "Unverified";

export interface VerificationStepType {
  id: number;
  title: string;
  status: VerificationStatus;
}

const getDocStatus = (
  status?: string | null,
  hasValue?: boolean,
): VerificationStatus => {
  if (status === "approved") return "Verified";
  if (status === "pending") return "Under Review";
  if (status === "rejected") return "Rejected";
  if (hasValue) return "Under Review";
  return "Unverified";
};

const VarificationCheckListPage = () => {
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const verificationStep = useMemo<VerificationStepType[]>(() => {
    if (!profile) {
      return [
        {
          id: 1,
          title: "Social Profile Verification",
          status: "Unverified",
        },
        {
          id: 2,
          title: "Phone No. Verification",
          status: "Unverified",
        },
        {
          id: 3,
          title: "Payment Setup",
          status: "Unverified",
        },
        {
          id: 4,
          title: "NID",
          status: "Unverified",
        },
        {
          id: 5,
          title: "Trade License",
          status: "Unverified",
        },
        {
          id: 6,
          title: "TIN",
          status: "Unverified",
        },
        {
          id: 7,
          title: "BIN",
          status: "Unverified",
        },
        {
          id: 8,
          title: "Email",
          status: "Unverified",
        },
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
        title: "Social Profile Verification",
        status: hasSocialLinks ? "Verified" : "Unverified",
      },
      {
        id: 2,
        title: "Phone No. Verification",
        status: profile.isPhoneVerified ? "Verified" : "Unverified",
      },
      {
        id: 3,
        title: "Payment Setup",
        status: hasPaymentSetup ? "Verified" : "Unverified",
      },
      {
        id: 4,
        title: "NID",
        status: getDocStatus(profile.nidVerification?.nidStatus, hasNid),
      },
      {
        id: 5,
        title: "Trade License",
        status: getDocStatus(
          profile.tradeLicenseVerification?.tradeLicenseStatus,
          hasTradeLicense,
        ),
      },
      {
        id: 6,
        title: "TIN",
        status: getDocStatus(profile.tinVerification?.tinStatus, hasTin),
      },
      {
        id: 7,
        title: "BIN",
        status: getDocStatus(profile.binVerification?.binStatus, hasBin),
      },
      {
        id: 8,
        title: "Email",
        status: profile.isEmailVerified ? "Verified" : "Unverified",
      },
    ];
  }, [profile]);

  const completedCount = verificationStep.filter(
    (item) => item.status === "Verified",
  ).length;

  const completionPercent = Math.round(
    (completedCount / verificationStep.length) * 100,
  );

  const hasUnderReview = verificationStep.some(
    (item) => item.status === "Under Review",
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
          <VerificationStatusCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default VarificationCheckListPage;
