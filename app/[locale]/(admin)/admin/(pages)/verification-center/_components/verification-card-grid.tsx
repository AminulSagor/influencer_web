"use client";

import VerificationCard from "./verification-card";
import type {
  VerificationCardDataType,
  VerificationTabKey,
} from "@/service/admin/verification-center/get-pending-profiles";

interface Props {
  data: VerificationCardDataType[];
  selectedKey: VerificationTabKey;
  onSelect: (key: VerificationTabKey) => void;
}

const VerificationCardGrid = ({ data, selectedKey, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(({ id, label, count, status, key }) => (
        <VerificationCard
          key={id}
          label={label}
          count={count}
          status={status}
          isSelected={selectedKey === key}
          onClick={() => onSelect(key)}
        />
      ))}
    </div>
  );
};

export default VerificationCardGrid;