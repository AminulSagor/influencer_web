// app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/payment-fail/page.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { notifyError } from "@/utils/toast_util";

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("brand.payment");
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    // Get transaction parameters from URL
    const tranId = searchParams.get("tran_id");
    const errorMessage = searchParams.get("error");
    const campaignIdFromUrl = searchParams.get("campaign_id");

    // Check sessionStorage for pending payment
    const pendingPayment = sessionStorage.getItem("pendingPayment");
    let pendingCampaignId: string | null = null;

    if (pendingPayment) {
      try {
        const paymentData = JSON.parse(pendingPayment);
        pendingCampaignId = paymentData.campaignId;
        sessionStorage.removeItem("pendingPayment");
      } catch (e) {
        console.error("Failed to parse pending payment:", e);
      }
    }

    const finalCampaignId = pendingCampaignId || campaignIdFromUrl;

    // Use requestAnimationFrame to batch state update
    requestAnimationFrame(() => {
      if (finalCampaignId) {
        setCampaignId(finalCampaignId);
      }
    });

    // Show error message only once using ref
    if (!hasNotifiedRef.current) {
      notifyError(errorMessage || t("paymentFailed"));
      hasNotifiedRef.current = true;
    }
  }, [searchParams, t]);

  const handleRetryPayment = () => {
    if (campaignId) {
      router.push(`/brand/campaign-details/${campaignId}`);
    } else {
      router.push("/brand/campaigns");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-red-600 sm:text-3xl">
          {t("paymentFailed")}
        </h1>

        <p className="mt-4 text-sm text-black/70 sm:text-base">
          {t("paymentFailMessage")}
        </p>

        <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800 text-left">
              {t("paymentFailHelpMessage")}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full rounded-xl bg-light-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-light-green/90 sm:text-base"
          >
            {t("retryPayment")}
          </button>

          <Link
            href="/brand/campaigns"
            className="block w-full rounded-xl border border-light-gray bg-white px-6 py-3 text-sm font-semibold text-Primary transition hover:bg-gray-50 sm:text-base"
          >
            {t("backToCampaigns")}
          </Link>
        </div>
      </div>
    </div>
  );
}
