"use client";

import React from "react";

type Props = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

const ProfileField = ({ label, required, error, children }: Props) => {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-light-green">
        {label} {required ? "*" : ""}
      </p>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default ProfileField;