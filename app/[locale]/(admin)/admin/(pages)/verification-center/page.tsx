import VerificationBreadcrumb from "./_components/verification-breadcrumb";
import VerificationCardsContainer from "./_components/verification-card-container";

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
