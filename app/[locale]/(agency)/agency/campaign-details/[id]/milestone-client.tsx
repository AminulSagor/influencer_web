"use client";
import PaymentMilestone from "../_components/payment-milestone-card";
import { PaymanetMilestoneDataType, paymentMileStoneData } from "./consts";
import MileStoneCard from "../_components/milestone-card";
import { useState } from "react";

interface Props {
  isAccepted: boolean;
}

const MilestoneClient = ({ isAccepted }: Props) => {
  const [selectedMilestone, setSelectedMilestone] =
    useState<PaymanetMilestoneDataType | null>(null);

  return (
    <>
      <div>
        <PaymentMilestone
          paymentMilestoneData={paymentMileStoneData}
          paid={1}
          total={4}
          selectedMilestone={selectedMilestone}
          onSelectMilestone={setSelectedMilestone}
        />
      </div>
      {isAccepted && selectedMilestone && (
        <div>
          <MileStoneCard milestone={selectedMilestone} />
        </div>
      )}
    </>
  );
};

export default MilestoneClient;
