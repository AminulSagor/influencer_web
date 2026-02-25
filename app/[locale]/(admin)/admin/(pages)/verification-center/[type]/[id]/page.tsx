// later: import ClientVerificationClient, AgencyVerificationClient

import InfluencerVerificationClient from "./_components/influencer-verification-client";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { type, id } = await params;

  if (type === "influencer") return <InfluencerVerificationClient userId={id} />;

  // if (type === "client") return <ClientVerificationClient userId={id} />;
  // if (type === "agency") return <AgencyVerificationClient userId={id} />;

  return <div className="p-4 text-sm text-light-gray">Unknown type: {type}</div>;
}