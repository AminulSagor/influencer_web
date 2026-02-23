import InfluencerVerificationClient from "./_components/influencer-verification-client";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  return <InfluencerVerificationClient userId={id} />;
};

export default page;