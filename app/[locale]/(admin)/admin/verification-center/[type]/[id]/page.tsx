import { verificationTableData } from "../../_components/verification-data";
import BioCard from "./_components/bio-card";
import InfoCard from "./_components/info-card";

interface Props {
  params: Promise<{ type: string; id: string }>;
}

const page = async ({ params }: Props) => {
  const { type, id } = await params;
  const typeKey = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const idNumber = Number(id);
  const dataForType =
    verificationTableData[typeKey as keyof typeof verificationTableData];
  const detail = dataForType?.find((item) => item.id === idNumber);
  if (!detail) {
    return <p>Verification data not found</p>;
  }

  const profile = detail.details?.profile;

  return (
    <div className="p-4">
      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <InfoCard
            name={profile?.name ?? "N/A"}
            location={profile?.location ?? "N/A"}
            verifiedStatus="Unverified"
            socialHandles={profile?.socialHandles}
          />
        </div>
        <div className="col-span-6">
          <BioCard />
        </div>
      </div>
    </div>
  );
};

export default page;
