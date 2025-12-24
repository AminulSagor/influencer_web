"use client";
import MileStoneCard from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/milestone-card";
import { PaymanetMilestoneDataType, paymentMileStoneData } from "./data";
import { useState } from "react";
import PaymentMilestone from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/payment-milestone-card";

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
