"use client";

import { useEffect, useMemo, useState } from "react";
import CollapsibleCard from "./collapsible-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getInfluencerPayoutProfile } from "@/service/admin/campaign/get-influencer-payout";

type PaymentMethodBank = {
  type: "bank";
  bankName: string;
  accountNumber: string;
  accountHolderName?: string;
};

type PaymentMethodWallet = {
  type: "mobile_wallet";
  walletName: string;
  phoneNumber: string;
  accountHolderName?: string;
};

type PaymentMethod = PaymentMethodBank | PaymentMethodWallet;

type AssignedInfluencer = {
  id: string; // profileId
  name: string;
  avatarUrl?: string | null;
};

type CampaignStatus =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";

function safeStr(v: unknown) {
  return String(v ?? "").trim();
}

function normalizePayoutMethods(raw: any): PaymentMethod[] {
  const payouts = raw?.data?.payouts ?? {};

  const bankList = Array.isArray(payouts?.bank) ? payouts.bank : [];
  const mobileList = Array.isArray(payouts?.mobileBanking)
    ? payouts.mobileBanking
    : [];

  const banks: PaymentMethodBank[] = bankList.map((item: any) => ({
    type: "bank",
    bankName: safeStr(item?.bankName) || "Bank Account",
    accountNumber: safeStr(item?.bankAccNo),
    accountHolderName: safeStr(item?.bankAccHolderName),
  }));

  const wallets: PaymentMethodWallet[] = mobileList.map((item: any) => ({
    type: "mobile_wallet",
    walletName: safeStr(item?.accountType) || "Mobile Wallet",
    phoneNumber: safeStr(item?.accountNo),
    accountHolderName: safeStr(item?.accountHolderName),
  }));

  return [...banks, ...wallets].filter((item) => {
    if (item.type === "bank") return !!item.accountNumber;
    return !!item.phoneNumber;
  });
}

const InfluencerPaymentMethod = ({
  campaignStatus,
  assignedInfluencers,
}: {
  campaignStatus: CampaignStatus;
  assignedInfluencers: AssignedInfluencer[];
}) => {
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(
    null
  );
  const [paymentMethodsByInfluencer, setPaymentMethodsByInfluencer] = useState<
    Record<string, PaymentMethod[]>
  >({});
  const [loadingByInfluencer, setLoadingByInfluencer] = useState<
    Record<string, boolean>
  >({});

  if (campaignStatus === "needs-quote") return null;

  const influencersData = useMemo(() => {
    return (assignedInfluencers ?? []).map((i) => ({
      id: safeStr(i.id),
      name: safeStr(i.name) || "Unknown Influencer",
      avatarUrl: i.avatarUrl ?? "/avatar-fallback.png",
    }));
  }, [assignedInfluencers]);

  useEffect(() => {
    if (!selectedInfluencerId && influencersData.length > 0) {
      setSelectedInfluencerId(influencersData[0].id);
    }
  }, [selectedInfluencerId, influencersData]);

  useEffect(() => {
    const fetchAllPayouts = async () => {
      if (influencersData.length === 0) return;

      await Promise.all(
        influencersData.map(async (influencer) => {
          if (!influencer.id) return;
          if (paymentMethodsByInfluencer[influencer.id]) return;

          setLoadingByInfluencer((prev) => ({
            ...prev,
            [influencer.id]: true,
          }));

          try {
            const res = await getInfluencerPayoutProfile(influencer.id);
            const methods = normalizePayoutMethods(res);

            setPaymentMethodsByInfluencer((prev) => ({
              ...prev,
              [influencer.id]: methods,
            }));
          } catch {
            setPaymentMethodsByInfluencer((prev) => ({
              ...prev,
              [influencer.id]: [],
            }));
          } finally {
            setLoadingByInfluencer((prev) => ({
              ...prev,
              [influencer.id]: false,
            }));
          }
        })
      );
    };

    fetchAllPayouts();
  }, [influencersData, paymentMethodsByInfluencer]);

  const selectedInfluencer = useMemo(() => {
    if (!selectedInfluencerId) return null;
    return influencersData.find((x) => x.id === selectedInfluencerId) ?? null;
  }, [selectedInfluencerId, influencersData]);

  const selectedMethods = useMemo(() => {
    if (!selectedInfluencer) return [];
    return paymentMethodsByInfluencer[selectedInfluencer.id] ?? [];
  }, [selectedInfluencer, paymentMethodsByInfluencer]);

  return (
    <CollapsibleCard heading="Influencer’s Payment Methods">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5 rounded-xl border border-slate-200 p-3 md:p-4 self-start">
          {influencersData.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-400">
              No influencers assigned yet.
            </div>
          ) : (
            <div className="max-h-[240px] overflow-y-auto pr-1">
              {influencersData.map((influencer, index) => {
                const isActive = selectedInfluencer?.id === influencer.id;
                const methodCount = (paymentMethodsByInfluencer[influencer.id] ?? [])
                  .length;

                return (
                  <div key={influencer.id}>
                    <div
                      className={cn(
                        "rounded-2xl border px-3 py-3 transition",
                        isActive
                          ? "border-light-green bg-linear-to-r from-white to-Secondary/70"
                          : "border-transparent bg-white"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-11 w-11 shrink-0">
                            <AvatarImage
                              src={influencer.avatarUrl || ""}
                              alt={influencer.name}
                            />
                            <AvatarFallback>
                              {influencer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-Primary truncate">
                              {influencer.name}
                            </p>
                            <p className="text-xs text-orange">
                              {loadingByInfluencer[influencer.id]
                                ? "Loading..."
                                : `${methodCount} Payment Method${methodCount === 1 ? "" : "s"
                                }`}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => setSelectedInfluencerId(influencer.id)}
                          variant="link"
                          className="text-xs shrink-0 text-Primary"
                        >
                          View &gt;
                        </Button>
                      </div>
                    </div>

                    {index !== influencersData.length - 1 && (
                      <div className="mx-3 border-b border-slate-200" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-7 rounded-xl border border-slate-200 p-3 md:p-4">
          <h3 className="mb-4 text-sm font-semibold text-Primary">
            Selected Influencer’s Payment Methods
          </h3>

          {!selectedInfluencer ? (
            <p className="text-sm text-gray-400">
              Select an influencer to see payment methods.
            </p>
          ) : loadingByInfluencer[selectedInfluencer.id] ? (
            <p className="text-sm text-gray-400">Loading payment methods...</p>
          ) : selectedMethods.length === 0 ? (
            <p className="text-sm text-gray-400">No payment methods available.</p>
          ) : (
            <ul className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {selectedMethods.map((method, index) => (
                <li
                  key={`${selectedInfluencer.id}-${index}`}
                  className="rounded-2xl border border-light-green/50 p-3 bg-linear-to-r from-white to-Secondary/70"
                >
                  {method.type === "bank" ? (
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden">
                        <Image src="/icons/bank-icon.svg" alt="Bank Icon" fill />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-light-green">
                          {method.bankName}
                        </p>
                        <p className="text-xs text-gray-500">DBBL</p>
                        <p className="text-sm font-medium text-Primary break-all">
                          Account No: {method.accountNumber}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                        <Image
                          src="/icons/bkash-icon.svg"
                          alt="Wallet Icon"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-light-green break-all">
                          {method.phoneNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method.walletName}
                        </p>
                        <p className="text-sm font-medium text-Primary">
                          {method.accountHolderName || selectedInfluencer.name}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default InfluencerPaymentMethod;