import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTab from "./pending-tab";
import CompletedTab from "./completed-tab";
import PartiallyCompletedTab from "./partially-completed-tab";
import type {
  BrandPendingPaymentResponse,
  CompletedPaymentResponse,
  PendingClearanceResponse,
} from "@/types/admin/finance/finance_pending_completed_type";
import type { PendingBonusesResponse } from "@/types/admin/finance/finance_bonus_clearance_type";
import type { PartiallyCompletedResponse } from "@/types/admin/finance/finance_partially_completed_type";

type Props = {
  pendingTabs: {
    agency: PendingClearanceResponse;
    influencer: PendingClearanceResponse;
    brand: BrandPendingPaymentResponse;
    bonus: PendingBonusesResponse;
  };
  completedTabs: {
    agency: CompletedPaymentResponse;
    influencer: CompletedPaymentResponse;
    brand: CompletedPaymentResponse;
  };
  partiallyCompletedTabs: {
    agency: PartiallyCompletedResponse;
    influencer: PartiallyCompletedResponse;
    brand: PartiallyCompletedResponse;
  };
};

const RowTwo = ({ pendingTabs, completedTabs, partiallyCompletedTabs }: Props) => {
  return (
    <div className="col-span-12">
      <Tabs defaultValue="pending">
        <TabsList className="w-full bg-white overflow-x-auto">
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
          <TabsTrigger
            value="partially"
            className="data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Partially Completed
          </TabsTrigger>
        </TabsList>

        <PendingTab tabsData={pendingTabs} />
        <CompletedTab tabsData={completedTabs} />
        <PartiallyCompletedTab tabsData={partiallyCompletedTabs} />
      </Tabs>
    </div>
  );
};

export default RowTwo;