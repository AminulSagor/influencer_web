"use client";

import { useEffect, useState } from "react";
import InfoCard from "./_components/info-card";
import ProfileCompletionPercentCard from "./_components/profile-completion-percent-card";
import VerificationInProgress from "./_components/verification-in-progress";
import VerificationStatusCard from "./_components/veriication-status-card";
import { getAgencyProfile } from "@/service/agency/account-settings";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import toast from "react-hot-toast";
import {
  requestAgencyEmailOtp,
  verifyAgencyEmailOtp,
} from "@/service/agency/email-verification";
import { EmailVerificationDialog } from "@/components/email-verification-dialog";
import { VerificationChecklistSkeleton } from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/verification-checklist/_components/verification-checklist-skeleton";

export interface VerificationStepType {
  id: number;
  title: string;
  status: string;
}

const getVerificationStatus = (
  status?: string,
): "Verified" | "Under Review" | "Unverified" => {
  const normalized = status?.trim().toLowerCase();

  if (normalized === "approved" || normalized === "verified") {
    return "Verified";
  }

  if (normalized === "pending" || normalized === "in_review") {
    return "Under Review";
  }

  return "Unverified";
};

const getPaymentSetupStatus = (
  profile: AgencyProfileResponse | null,
): "Verified" | "Under Review" | "Unverified" => {
  const payouts = [
    ...(profile?.payouts?.bank ?? []),
    ...(profile?.payouts?.mobileBanking ?? []),
  ];

  if (payouts.length === 0) return "Unverified";

  const hasApproved = payouts.some(
    (item) => item.accStatus?.trim().toLowerCase() === "approved",
  );

  if (hasApproved) return "Verified";

  const hasPending = payouts.some((item) => {
    const status = item.accStatus?.trim().toLowerCase();
    return status === "pending" || status === "in_review";
  });

  if (hasPending) return "Under Review";

  return "Unverified";
};

const getProfileCompletionPercentage = (
  profile: AgencyProfileResponse | null,
) => {
  if (!profile) return 0;

  const checks = [
    !!profile.agencyName,
    !!profile.firstName,
    !!profile.lastName,
    !!profile.logo,
    !!profile.agencyBio,
    !!profile.serviceFee,
    !!profile.dollarRate,
    !!profile.address?.thana,
    !!profile.address?.zilla,
    !!profile.address?.fullAddress,
    (profile.niches?.length ?? 0) > 0,
    (profile.socialLinks?.length ?? 0) > 0,
    !!profile.nidNumber,
    !!profile.tradeLicenseNumber,
    !!profile.tinNumber,
    !!profile.binNumber,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const Page = () => {
  const [profile, setProfile] = useState<AgencyProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAgencyProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getAgencyProfile();
        setProfile(response);
      } catch (error) {
        console.error("Failed to load verification checklist profile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencyProfile();
  }, []);

  if (isLoading) {
    return <VerificationChecklistSkeleton />;
  }

  const verificationStep: VerificationStepType[] = [
    {
      id: 1,
      title: "Social Profile Verification",
      status:
        (profile?.socialLinks?.length ?? 0) > 0 ? "Verified" : "Unverified",
    },
    {
      id: 2,
      title: "Phone No. Verification",
      status: profile?.isPhoneVerified ? "Verified" : "Unverified",
    },
    {
      id: 3,
      title: "Payment Setup",
      status: getPaymentSetupStatus(profile),
    },
    {
      id: 4,
      title: "NID",
      status: getVerificationStatus(profile?.nidVerification?.nidStatus),
    },
    {
      id: 5,
      title: "Trade License",
      status: getVerificationStatus(
        profile?.tradeLicenseVerification?.tradeLicenseStatus,
      ),
    },
    {
      id: 6,
      title: "TIN",
      status: getVerificationStatus(profile?.tinVerification?.tinStatus),
    },
    {
      id: 7,
      title: "BIN",
      status: getVerificationStatus(profile?.binVerification?.binStatus),
    },
    {
      id: 8,
      title: "Email",
      status: profile?.isEmailVerified ? "Verified" : "Unverified",
    },
  ];

  const verifiedStatus =
    verificationStep.length > 0 &&
    verificationStep.every((item) => item.status === "Verified");

  const completionPercentage = getProfileCompletionPercentage(profile);

  //verification for email

  const handleVerificationStepClick = async (item: VerificationStepType) => {
    if (item.title !== "Email") return;

    if (profile?.isEmailVerified) {
      toast.success("Email already verified");
      return;
    }

    try {
      await requestAgencyEmailOtp();
      toast.success("Verification code sent to your email");
      setEmailDialogOpen(true);
    } catch (error) {
      toast.error("Failed to send verification code");
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-5xl mx-auto">
      <section className="grid grid-cols-1 gap-4">
        <InfoCard status={verifiedStatus} profile={profile} />

        {!verifiedStatus && <VerificationInProgress />}
      </section>

      <ProfileCompletionPercentCard percentage={completionPercentage} />

      {verificationStep.map((item) => (
        <VerificationStatusCard
          key={item.id}
          item={item}
          onClick={
            item.title === "Email" && item.status === "Unverified"
              ? () => handleVerificationStepClick(item)
              : undefined
          }
        />
      ))}

      <EmailVerificationDialog
        open={emailDialogOpen}
        email={profile?.email ?? ""}
        onOpenChange={setEmailDialogOpen}
        verifyOtp={verifyAgencyEmailOtp}
        onVerified={() =>
          setProfile((currentProfile: AgencyProfileResponse | null) =>
            currentProfile
              ? { ...currentProfile, isEmailVerified: true }
              : currentProfile,
          )
        }
      />
    </div>
  );
};

export default Page;
