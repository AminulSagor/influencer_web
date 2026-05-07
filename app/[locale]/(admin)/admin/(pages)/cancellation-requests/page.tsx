import React from 'react';
import CancellationRequestsCard from "./_components/cancellation-requests-card";
import { getCancellationRequests } from "@/service/admin/campaign/get-cancellation-requests";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = (await searchParams) ?? {};

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);

  const requests = await getCancellationRequests({ page, limit });

  return (
    <div className="p-4">
      <CancellationRequestsCard
        requests={requests}
        filters={{ page, limit }}
      />
    </div>
  );
};

export default Page;