import React from "react";
import ReportCard from "./_components/report-card";
import { getReports } from "@/service/admin/reports/get-reports";
import { ReportStatus, ReportUserType } from "@/types/admin/reports/reports_type";

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    userType?: ReportUserType;
    status?: ReportStatus;
    search?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = (await searchParams) ?? {};

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const userType = params.userType ?? "AGENCY";
  const status = params.status ?? null;
  const search = params.search ?? "";

  const reports = await getReports({
    page,
    limit,
    userType,
    status: status ?? undefined,
    search,
  });

  return (
    <div className="p-4">
      <ReportCard
        reports={reports}
        filters={{
          page,
          limit,
          userType,
          status,
          search,
        }}
      />
    </div>
  );
};

export default Page;