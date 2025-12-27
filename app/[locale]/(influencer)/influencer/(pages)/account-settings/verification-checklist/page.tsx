import InfoCard from "./_components/info-card";
import ProfileCompletionPercentCard from "./_components/profile-completion-percent-card";
import VerificationInProgress from "./_components/verification-in-progress";
import VerificationStatusCard from "./_components/veriication-status-card";

export interface VerificationStepType {
  id: number;
  title: string;
  status: string;
}

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
const page = () => {
  const verfiedStatus = false;
  return (
    <div className="p-4 space-y-4">
      {/* row 1 */}
      <div>
        {!verfiedStatus ? (
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="lg:w-2/3">
              <InfoCard status={verfiedStatus} />
            </div>
            <div className="lg:w-1/3">
              <VerificationInProgress />
            </div>
          </div>
        ) : (
          <div>
            <InfoCard status={verfiedStatus} />
          </div>
        )}
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

export default page;
