import VerificationBreadcrumb from "../../_components/verification-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard from "../../_components/user-card";
import { headers } from "next/headers";
import { userData } from "../../_components/user-data";

const page = async () => {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  type UserType = keyof typeof userData;
  const lastSegment = pathname?.split("/").pop();
  const userType: UserType = (
    lastSegment && lastSegment in userData ? lastSegment : "influencer"
  ) as UserType;

  const data = userData[userType];

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="influencer" name="Hania amir" />
      <VariantLinksCard />
      <UserCard users={data} />
    </div>
  );
};

export default page;
