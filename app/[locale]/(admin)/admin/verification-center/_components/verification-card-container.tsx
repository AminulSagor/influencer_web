"use client"; // this directive is important for client components

import React, { useState } from "react";
import VerificationCardGrid from "./verification-card-grid";
import { verificationData } from "./verification-data";

const VerificationCardsContainer = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedCard = verificationData.find((item) => item.id === selectedId);

  return (
    <>
      <VerificationCardGrid
        data={verificationData}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {selectedCard && (
        <div className="mt-6">
          {/* Render table with selectedCard details */}
          {/* Same table markup as before */}
        </div>
      )}
    </>
  );
};

export default VerificationCardsContainer;
