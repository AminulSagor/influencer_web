import ProfileCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/_components/profile-card";
import ProfileCompletionPercentCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/profile-completion-percent-card";
import VerificationInProgress from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/verification-in-progress";
import VerificationStatusCard from "@/app/[locale]/(brand)/brand/(pages)/account-settings/varification-checklist/_components/veriication-status-card";
import React from "react";

export interface VerificationStepType {
  id: number;
  title: string;
  status: string;
}
const VarificationCheckListPage = () => {
  const verificationStep = [
    {
      id: 1,
      title: "Social Profile Verification",
      status: "Verified",
    },
    {
      id: 2,
      title: "Phone No. Verification",
      status: "Verified",
    },
    {
      id: 3,
      title: "Payment Setup",
      status: "Under Review",
    },
    {
      id: 4,
      title: "NID",
      status: "Under Review",
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
  return (
    <div className="p-4 space-y-4">
      {/* row 1 */}
      <div>
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="lg:w-2/3">
            <ProfileCard />
          </div>
          <div className="lg:w-1/3">
            <VerificationInProgress />
          </div>
        </div>
      </div>
      {/* row 2 */}
      <div>
        <ProfileCompletionPercentCard />
      </div>
      {/* dynamic row */}
      <div className="space-y-2">
        {verificationStep.map((item) => (
          <VerificationStatusCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default VarificationCheckListPage;
