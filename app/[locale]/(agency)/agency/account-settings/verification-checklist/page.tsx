"use client";

import { useEffect, useState } from "react";
import InfoCard from "./_components/info-card";
import ProfileCompletionPercentCard from "./_components/profile-completion-percent-card";
import VerificationInProgress from "./_components/verification-in-progress";
import VerificationStatusCard from "./_components/veriication-status-card";
import { getAgencyProfile } from "@/service/agency/account-settings";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

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

const page = () => {
  const [profile, setProfile] = useState<AgencyProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const verificationStep: VerificationStepType[] = [
    {
      id: 1,
      title: "Social Profile Verification",
      status: (profile?.socialLinks?.length ?? 0) > 0 ? "Verified" : "Unverified",
    },
    {
      id: 2,
      title: "Phone No. Verification",
      status: profile?.isPhoneVerified ? "Verified" : "Unverified",
    },
    {
      id: 3,
      title: "Payment Setup",
      status:
        (profile?.payouts?.bank?.length ?? 0) > 0 ||
          (profile?.payouts?.mobileBanking?.length ?? 0) > 0
          ? "Under Review"
          : "Unverified",
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

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-12 items-center gap-4">
        {!verifiedStatus ? (
          <>
            <div className="col-span-8">
              <InfoCard status={verifiedStatus} profile={profile} />
            </div>
            <div className="col-span-4">
              <VerificationInProgress />
            </div>
          </>
        ) : (
          <div className="col-span-12">
            <InfoCard status={verifiedStatus} profile={profile} />
          </div>
        )}
      </div>

      <div>
        <ProfileCompletionPercentCard percentage={completionPercentage} />
      </div>

      <div className="space-y-2">
        {isLoading
          ? null
          : verificationStep.map((item) => (
            <VerificationStatusCard key={item.id} item={item} />
          ))}
      </div>
    </div>
  );
};

export default page;