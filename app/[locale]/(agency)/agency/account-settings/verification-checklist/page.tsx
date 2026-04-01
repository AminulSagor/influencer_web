import InfoCard from "./_components/info-card";
import ProfileCompletionPercentCard from "./_components/profile-completion-percent-card";
import VerificationInProgress from "./_components/verification-in-progress";
import VerificationStatusCard from "./_components/veriication-status-card";

export interface VerificationStepType {
  id: number;
  title: string;
  status: string;
}

const verificationStep: VerificationStepType[] = [
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

const page = () => {
  const verfiedStatus = false;

  const completedSteps = verificationStep.filter(
    (item) => item.status === "Verified",
  ).length;

  const completionPercentage =
    verificationStep.length === 0
      ? 0
      : Math.round((completedSteps / verificationStep.length) * 100);

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-12 items-center gap-4">
        {!verfiedStatus ? (
          <>
            <div className="col-span-8">
              <InfoCard status={verfiedStatus} />
            </div>
            <div className="col-span-4">
              <VerificationInProgress />
            </div>
          </>
        ) : (
          <div className="col-span-12">
            <InfoCard status={verfiedStatus} />
          </div>
        )}
      </div>

      <div>
        <ProfileCompletionPercentCard percentage={completionPercentage} />
      </div>

      <div className="space-y-2">
        {verificationStep.map((item) => (
          <VerificationStatusCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default page;