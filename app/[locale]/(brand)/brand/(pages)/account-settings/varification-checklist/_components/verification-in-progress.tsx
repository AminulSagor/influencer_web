import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  hasUnderReview: boolean;
}

const VerificationInProgress = ({ hasUnderReview }: Props) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-light-green bg-Secondary p-4">
      <div className="text-light-green">
        {hasUnderReview ? (
          <FaExclamationCircle size={22} />
        ) : (
          <FaCheckCircle size={22} />
        )}
      </div>

      <div>
        <h2 className="font-semibold text-Primary">
          {hasUnderReview ? "Verification In Progress" : "Verification Updated"}
        </h2>
        <p className="text-sm text-light-green">
          {hasUnderReview
            ? "We’ll notify you once all items are verified"
            : "Your latest verification status is shown below"}
        </p>
      </div>
    </div>
  );
};

export default VerificationInProgress;