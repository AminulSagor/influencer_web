import VerificationBreadcrumb from "../../_components/verification-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard from "../../_components/user-card";

const page = () => {
  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="influencer" name="Hania amir" />
      <VariantLinksCard />
    
    </div>
  );
};

export default page;
