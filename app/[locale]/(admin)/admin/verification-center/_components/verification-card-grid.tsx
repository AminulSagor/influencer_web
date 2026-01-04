"use client";

import { useState } from "react";
import VerificationCard from "./verification-card";

type VerificationCardDataType = {
  id: number;
  label: "Influencer" | "Brand" | "Agency";
  count: number;
  status: "Pending";
};

interface Props {
  data: VerificationCardDataType[];
  selectedId: number | null; // add this
  onSelect: (id: number) => void; // add this
}

const VerificationCardGrid = ({ data, selectedId, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(({ id, label, count, status }) => (
        <VerificationCard
          key={id}
          label={label}
          count={count}
          status={status}
          isSelected={selectedId === id}
          onClick={() => onSelect(id)}
        />
      ))}
    </div>
  );
};

export default VerificationCardGrid;
