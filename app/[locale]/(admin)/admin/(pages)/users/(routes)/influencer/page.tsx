import VerificationBreadcrumb from "../../_components/verification-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard from "../../_components/user-card";
import { headers } from "next/headers";
import { userData } from "../../_components/user-data";

const page = async () => {
  const data = userData["influencer"];

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="influencer" name="Hania amir" />
      <VariantLinksCard />
      <UserCard users={data} />
    </div>
  );
};

export default page;
