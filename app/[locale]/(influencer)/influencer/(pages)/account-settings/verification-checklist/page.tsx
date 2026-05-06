"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import InfoCard from "./_components/info-card";
import ProfileCompletionPercentCard from "./_components/profile-completion-percent-card";
import VerificationInProgress from "./_components/verification-in-progress";
import VerificationStatusCard from "./_components/veriication-status-card";

import {
  requestInfluencerEmailOtp,
  verifyInfluencerEmailOtp,
} from "@/service/influencer/email-verification";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";
import { getInfluencerProfile } from "@/service/influencer/profile/profile";
import { VerificationChecklistSkeleton } from "@/app/[locale]/(influencer)/influencer/(pages)/account-settings/verification-checklist/_components/verification-checklist-skeleton";
import { EmailVerificationDialog } from "@/components/email-verification-dialog";

export interface VerificationStepType {
  id: number;
  title: string;
  status: string;
}

const getVerificationStatus = (
  status?: string,
): "Verified" | "Under Review" | "Unverified" => {
  const normalized = status?.trim().toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "verified" ||
    normalized === "active"
  ) {
    return "Verified";
  }

  if (normalized === "pending" || normalized === "in_review") {
    return "Under Review";
  }

  return "Unverified";
};

const getPaymentSetupStatus = (
  profile: InfluencerProfileData | null,
): "Verified" | "Under Review" | "Unverified" => {
  const payouts = [
    ...(profile?.payouts?.bank ?? []),
    ...(profile?.payouts?.mobileBanking ?? []),
  ];

  if (payouts.length === 0) return "Unverified";

  const hasApproved = payouts.some((item) => {
    const status = item.accStatus?.trim().toLowerCase();
    return (
      status === "approved" || status === "verified" || status === "active"
    );
  });

  if (hasApproved) return "Verified";

  const hasPending = payouts.some((item) => {
    const status = item.accStatus?.trim().toLowerCase();
    return status === "pending" || status === "in_review";
  });

  if (hasPending) return "Under Review";

  return "Unverified";
};

const getProfileCompletionPercentage = (
  profile: InfluencerProfileData | null,
) => {
  if (!profile) return 0;

  const defaultAddress = profile.addresses?.[0];

  const checks = [
    !!profile.firstName,
    !!profile.lastName,
    !!profile.profileImg,
    !!profile.bio,
    !!defaultAddress?.thana,
    !!defaultAddress?.zilla,
    !!defaultAddress?.fullAddress,
    (profile.niches?.length ?? 0) > 0,
    (profile.skills?.length ?? 0) > 0,
    (profile.socialLinks?.length ?? 0) > 0,
    !!profile.nidNumber,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const Page = () => {
  const [profile, setProfile] = useState<InfluencerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  useEffect(() => {
    const fetchInfluencerProfile = async () => {
      try {
        setIsLoading(true);

        const response = await getInfluencerProfile();
        setProfile(response);
      } catch (error) {
        console.error("Failed to load influencer profile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencerProfile();
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
      title: "Skills",
      status:
        (profile?.skills?.length ?? 0) > 0 &&
        profile?.skills?.some(
          (item) => getVerificationStatus(item.status) === "Verified",
        )
          ? "Verified"
          : (profile?.skills?.length ?? 0) > 0
            ? "Under Review"
            : "Unverified",
    },
    {
      id: 6,
      title: "Niches",
      status:
        (profile?.niches?.length ?? 0) > 0 &&
        profile?.niches?.some(
          (item) => getVerificationStatus(item.status) === "Verified",
        )
          ? "Verified"
          : (profile?.niches?.length ?? 0) > 0
            ? "Under Review"
            : "Unverified",
    },
    {
      id: 7,
      title: "Email",
      status: profile?.isEmailVerified ? "Verified" : "Unverified",
    },
  ];

  const verifiedStatus =
    verificationStep.length > 0 &&
    verificationStep.every((item) => item.status === "Verified");

  const completionPercentage = getProfileCompletionPercentage(profile);

  const handleVerificationStepClick = async (item: VerificationStepType) => {
    if (item.title !== "Email") return;

    if (profile?.isEmailVerified) {
      toast.success("Email already verified");
      return;
    }

    try {
      await requestInfluencerEmailOtp();
      toast.success("Verification code sent to your email");
      setEmailDialogOpen(true);
    } catch (error) {
      toast.error("Failed to send verification code");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <section className="grid grid-cols-1 gap-4">
        <InfoCard status={verifiedStatus} profile={profile} />

        {!verifiedStatus && <VerificationInProgress />}
      </section>

      <ProfileCompletionPercentCard percentage={completionPercentage} />

      <div className="space-y-2">
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
      </div>

      <EmailVerificationDialog
        open={emailDialogOpen}
        email={profile?.email ?? ""}
        onOpenChange={setEmailDialogOpen}
        verifyOtp={verifyInfluencerEmailOtp}
        onVerified={() =>
          setProfile((currentProfile: InfluencerProfileData | null) =>
            currentProfile
              ? {
                  ...currentProfile,
                  isEmailVerified: true,
                }
              : currentProfile,
          )
        }
      />
    </div>
  );
};

export default Page;
