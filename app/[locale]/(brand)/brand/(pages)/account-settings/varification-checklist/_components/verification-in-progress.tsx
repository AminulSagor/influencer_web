"use client";

import { useTranslations } from "next-intl";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface Props {
  hasUnderReview: boolean;
}

const VerificationInProgress = ({ hasUnderReview }: Props) => {
  const t = useTranslations("brand.verificationChecklist");

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
          {hasUnderReview
            ? t("verificationInProgress")
            : t("verificationUpdated")}
        </h2>
        <p className="text-sm text-light-green">
          {hasUnderReview
            ? t("verificationInProgressDescription")
            : t("verificationUpdatedDescription")}
        </p>
      </div>
    </div>
  );
};

export default VerificationInProgress;
