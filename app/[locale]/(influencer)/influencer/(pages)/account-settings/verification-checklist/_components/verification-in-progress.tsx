import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const VerificationInProgress = () => {
  return (
    <div className="border border-light-green p-4 rounded-lg flex items-center  gap-4 bg-Secondary">
      <div className="text-light-green">
        <FaExclamationCircle size={22} />
      </div>
      <div>
        <h2 className="text-Primary font-semibold">Verification In Progress</h2>
        <p className="text-light-green text-sm">
          We’ll notify you once all items are verified
        </p>
      </div>
    </div>
  );
};

export default VerificationInProgress;
