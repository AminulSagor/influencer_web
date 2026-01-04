import VerificationBreadcrumb from "./_components/verification-breadcrumb";
import VerificationCard from "./_components/verification-card";
import VerificationCardsContainer from "./_components/verification-card-container";
import VerificationCardGrid from "./_components/verification-card-grid";
import { verificationData } from "./_components/verification-data";

const page = () => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <VerificationBreadcrumb type="agency" name="Grow Big" />
        <VerificationCardsContainer />
      </div>
    </div>
  );
};

export default page;
