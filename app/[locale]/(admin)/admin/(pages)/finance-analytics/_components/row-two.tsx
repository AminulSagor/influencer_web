import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTab from "./pending-tab";
import CompletedTab from "./completed-tab";
import type {
  BrandPendingPaymentResponse,
  CompletedPaymentResponse,
  PendingClearanceResponse,
} from "@/types/admin/finance/finance_pending_completed_type";

type Props = {
  pendingTabs: {
    agency: PendingClearanceResponse;
    influencer: PendingClearanceResponse;
    brand: BrandPendingPaymentResponse;
  };
  completedTabs: {
    agency: CompletedPaymentResponse;
    influencer: CompletedPaymentResponse;
    brand: CompletedPaymentResponse;
  };
};

const RowTwo = ({ pendingTabs, completedTabs }: Props) => {
  return (
    <div className="col-span-12">
      <Tabs defaultValue="pending">
        <TabsList className="w-full bg-white">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Pending Clearance
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <PendingTab tabsData={pendingTabs} />
        <CompletedTab tabsData={completedTabs} />
      </Tabs>
    </div>
  );
};

export default RowTwo;