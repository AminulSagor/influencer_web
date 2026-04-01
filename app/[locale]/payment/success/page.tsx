// app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/payment-success/page.tsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/spin-loader";
import { notifySuccess } from "@/utils/toast_util";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("brand.payment");
  const [isProcessing, setIsProcessing] = useState(true);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const hasNotifiedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Get transaction parameters from URL
    const tranId = searchParams.get("tran_id");
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");
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

    // Use setTimeout for state updates to avoid cascading renders
    timerRef.current = setTimeout(() => {
      if (finalCampaignId) {
        setCampaignId(finalCampaignId);
      }
      setIsProcessing(false);
    }, 100);

    // Show success message only once using ref
    if (!hasNotifiedRef.current) {
      notifySuccess(t("paymentSuccessful"));
      hasNotifiedRef.current = true;
    }

    // Cleanup timer
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchParams, t]);

  const handleViewCampaign = () => {
    if (campaignId) {
      router.push(`/brand/campaign-details/${campaignId}`);
    } else {
      router.push("/brand/campaigns");
    }
  };

  if (isProcessing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader className="h-12 w-12" />
        <p className="mt-4 text-sm text-black/70">{t("processingPayment")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-Primary sm:text-3xl">
          {t("paymentSuccessful")}
        </h1>

        <p className="mt-4 text-sm text-black/70 sm:text-base">
          {t("paymentSuccessMessage")}
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleViewCampaign}
            className="w-full rounded-xl bg-light-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-light-green/90 sm:text-base"
          >
            {t("viewCampaign")}
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
