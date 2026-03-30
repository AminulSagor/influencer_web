"use client";

import React from "react";

type Props = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const VerificationField = ({ label, error, children }: Props) => {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-orange">{label}</p>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default VerificationField;