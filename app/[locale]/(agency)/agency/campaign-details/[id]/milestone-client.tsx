"use client";

import PaymentMilestone from "../_components/payment-milestone-card";
import { PaymanetMilestoneDataType } from "./consts";
import MileStoneCard from "../_components/milestone-card";
import { useEffect, useState } from "react";

interface Props {
  isAccepted: boolean;
  milestones: PaymanetMilestoneDataType[];
  paid: number;
  total: number;
}

const MilestoneClient = ({ isAccepted, milestones, paid, total }: Props) => {
  const [selectedMilestone, setSelectedMilestone] =
    useState<PaymanetMilestoneDataType | null>(null);

  useEffect(() => {
    if (milestones.length > 0) {
      setSelectedMilestone(milestones[0]);
    } else {
      setSelectedMilestone(null);
    }
  }, [milestones]);

  return (
    <>
      <div>
        <PaymentMilestone
          paymentMilestoneData={milestones}
          paid={paid}
          total={total}
          selectedMilestone={selectedMilestone}
          onSelectMilestone={setSelectedMilestone}
        />
      </div>

      {selectedMilestone && (
        <div>
          <MileStoneCard milestone={selectedMilestone} canSubmit={isAccepted} />
        </div>
      )}
    </>
  );
};

export default MilestoneClient;