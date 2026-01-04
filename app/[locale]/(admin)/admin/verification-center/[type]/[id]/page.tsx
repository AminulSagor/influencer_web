import { verificationTableData } from "../../_components/verification-data";

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

  return (
    <div className="p-4">
      <h1>Verification Detail for {typeKey}</h1>
      <p>Name: {detail.name}</p>
      <p>Pending Items: {detail.pendingItems}</p>
      <p>Approval Progress: {detail.approvalProgress}%</p>
    </div>
  );
};

export default page;
