import { Card } from "@/components/ui/card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import RequoteTimeLeftCard from "../_components/requote-time-left-card";
import DeadlineCard from "../_components/deadline-card";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="p-4 space-y-4">
      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-6">
          <CampaignDetailsCard />
        </div>
        <div className="col-span-12 sm:col-span-3">
          <RequoteTimeLeftCard />
        </div>
        <div className="col-span-12 sm:col-span-3">
          <DeadlineCard />
        </div>
      </div>

      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-4">
          <Card></Card>
        </div>
        <div className="col-span-12 sm:col-span-4">
          <Card></Card>
        </div>
        <div className="col-span-12 sm:col-span-4">
          <Card></Card>
        </div>
      </div>
    </div>
  );
};

export default page;
