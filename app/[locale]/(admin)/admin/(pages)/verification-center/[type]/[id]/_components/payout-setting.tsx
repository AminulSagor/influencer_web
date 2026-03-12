"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";
import NotifyUser from "./notify-user";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { approveRejectPayout } from "@/service/admin/verification-center/influencer/approve-reject-payout";
import { approveRejectAgencyPayout } from "@/service/admin/verification-center/agency/approve-reject-payout";

type VerificationStatus = "Pending" | "Rejected" | "Accepted" | "Approved";
type PayoutType = "Bank Account" | "Bkash";
type VerificationType = "influencer" | "agency";

interface PayoutSettingsItem {
  id: number | string;
  type: PayoutType;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
  branchName?: string;
  phoneNumber?: string;
  status: VerificationStatus;
  rejectReason?: string | null;
}

interface NormalizedPayoutSettingsItem extends PayoutSettingsItem {
  bankSequence: number | null;
}

interface Props {
  userId: string;
  payoutSettings: PayoutSettingsItem[];
  verificationType?: VerificationType;
}

const normalizeStatus = (status?: string | null): VerificationStatus => {
  const value = (status ?? "").trim().toLowerCase();

  if (value === "approved") return "Approved";
  if (value === "accepted") return "Accepted";
  if (value === "rejected") return "Rejected";
  return "Pending";
};

const statusBadgeClassMap: Record<
  Exclude<VerificationStatus, "Pending">,
  string
> = {
  Approved: "bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee]",
  Accepted: "bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee]",
  Rejected: "bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0]",
};

const PayoutSettings = ({
  userId,
  payoutSettings,
  verificationType = "influencer",
}: Props) => {
  const [openIds, setOpenIds] = useState<(number | string)[]>([]);
  const [items, setItems] = useState<PayoutSettingsItem[]>(payoutSettings);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PayoutSettingsItem | null>(
    null
  );
  const [loadingId, setLoadingId] = useState<number | string | null>(null);

  const normalizedItems = useMemo<NormalizedPayoutSettingsItem[]>(() => {
    let bankCounter = 0;

    return items.map((item, index) => {
      const type: PayoutType = item.type === "Bkash" ? "Bkash" : "Bank Account";

      if (type === "Bank Account") {
        bankCounter += 1;
      }

      return {
        ...item,
        id: item.id ?? `${type}-${index}`,
        type,
        status: normalizeStatus(item.status),
        bankSequence: type === "Bank Account" ? bankCounter : null,
      };
    });
  }, [items]);

  const toggleOpen = (id: number | string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateLocalItem = (
    id: number | string,
    status: VerificationStatus,
    rejectReason?: string | null
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, rejectReason: rejectReason ?? null }
          : item
      )
    );
  };

  const submitAction = async ({
    payoutType,
    accountNo,
    status,
    rejectReason,
  }: {
    payoutType: "bank" | "mobile";
    accountNo: string;
    status: "approved" | "rejected";
    rejectReason?: string;
  }) => {
    if (verificationType === "agency") {
      return approveRejectAgencyPayout({
        userId,
        payoutType,
        accountNo,
        status,
        rejectReason,
      });
    }

    return approveRejectPayout({
      userId,
      payoutType,
      accountNo,
      status,
      rejectReason,
    });
  };

  const handleApprove = async (payout: PayoutSettingsItem) => {
    const accountNo =
      payout.type === "Bank Account"
        ? payout.accountNumber ?? ""
        : payout.phoneNumber ?? "";

    if (!accountNo) return;

    try {
      setLoadingId(payout.id);

      await submitAction({
        payoutType: payout.type === "Bank Account" ? "bank" : "mobile",
        accountNo,
        status: "approved",
      });

      updateLocalItem(payout.id, "Approved");
    } catch (error) {
      console.error("approve payout failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedItem) return;

    const accountNo =
      selectedItem.type === "Bank Account"
        ? selectedItem.accountNumber ?? ""
        : selectedItem.phoneNumber ?? "";

    if (!accountNo) return;

    try {
      setLoadingId(selectedItem.id);

      await submitAction({
        payoutType: selectedItem.type === "Bank Account" ? "bank" : "mobile",
        accountNo,
        status: "rejected",
        rejectReason: reason,
      });

      updateLocalItem(selectedItem.id, "Rejected", reason);
      setRejectOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("reject payout failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <CollapsibleCard
        heading="Payout Settings"
        action={
          <NotifyUser
            userId={userId}
            targetRole={verificationType}
            reminderKey="payout"
            customLabel="Payout Method"
          />
        }
      >
        <div className="space-y-3">
          {normalizedItems.map((payout) => {
            const isFirstBank =
              payout.type === "Bank Account" && payout.bankSequence === 1;

            const isSecondOrMoreBank =
              payout.type === "Bank Account" &&
              !!payout.bankSequence &&
              payout.bankSequence > 1;

            const borderClass = isSecondOrMoreBank
              ? "border-orange"
              : "border-light-green";

            const bgClass = isSecondOrMoreBank
              ? "bg-gradient-to-r from-white to-orange/20"
              : "bg-linear-to-r from-white to-Secondary";

            const textClass = isSecondOrMoreBank
              ? "text-orange"
              : "text-light-green";

            const normalizedStatusValue = payout.status.toLowerCase();
            const isPending = normalizedStatusValue === "pending";
            const isOpen = openIds.includes(payout.id);
            const isLoading = loadingId === payout.id;

            const approvedBtnVariant =
              payout.type === "Bank Account" && isSecondOrMoreBank
                ? "orange"
                : "lightGreen";

            return (
              <div
                key={payout.id}
                className={cn("rounded-md border", borderClass, bgClass)}
              >
                <Item
                  className="border-0 bg-transparent shadow-none"
                  variant="outline"
                >
                  <ItemContent className="min-w-0 flex-1">
                    {payout.type === "Bank Account" ? (
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="shrink-0">
                          <div className="relative aspect-square w-10">
                            <Image
                              src={
                                isFirstBank
                                  ? "/icons/bank-icon.svg"
                                  : "/icons/bank-icon-2.svg"
                              }
                              fill
                              alt="Bank"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <ItemTitle className={textClass}>
                            Bank Account no. {payout.bankSequence}
                          </ItemTitle>

                          <div>
                            <p className="text-xs text-gray-400">
                              {payout.bankName || "N/A"}
                            </p>
                            <p className={cn(textClass, "line-clamp-1")}>
                              Account No. {payout.accountNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="shrink-0">
                          <div className="relative aspect-square w-8">
                            <Image
                              className="object-contain"
                              src="/icons/bkash-icon.svg"
                              fill
                              alt="Bkash"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <ItemTitle className="text-light-green">
                            {payout.phoneNumber || "N/A"}
                          </ItemTitle>

                          <div>
                            <p className="text-xs text-gray-400">Bkash</p>
                            <p className="line-clamp-1 text-light-green">
                              {payout.accountHolder || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </ItemContent>

                  <ItemActions className="flex shrink-0 items-center gap-3">
                    {isPending ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="min-w-[108px] rounded-2xl border-[#d7d7d7] bg-white text-black hover:bg-[#fafafa]"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedItem(payout);
                            setRejectOpen(true);
                          }}
                        >
                          {isLoading ? "Please wait..." : "Reject"}
                        </Button>

                        <Button
                          type="button"
                          variant={approvedBtnVariant}
                          size="sm"
                          className="min-w-[108px] rounded-2xl"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void handleApprove(payout);
                          }}
                        >
                          {isLoading ? "Please wait..." : "Approve"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className={cn(
                          "min-w-[92px] border-0",
                          statusBadgeClassMap[
                            payout.status as Exclude<VerificationStatus, "Pending">
                          ]
                        )}
                      >
                        {payout.status}
                      </Button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleOpen(payout.id)}
                      className="text-gray-500"
                    >
                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </ItemActions>
                </Item>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2 rounded-md bg-white/60 p-4 text-sm">
                      {payout.type === "Bank Account" ? (
                        <>
                          <div>
                            <p className="text-xs text-gray-400">
                              Bank Account Holder
                            </p>
                            <p>{payout.accountHolder || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Bank Account Number
                            </p>
                            <p>{payout.accountNumber || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Routing Number
                            </p>
                            <p>{payout.routingNumber || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Branch Name</p>
                            <p>{payout.branchName || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Bank Name</p>
                            <p>{payout.bankName || "N/A"}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-xs text-gray-400">
                              Mobile Banking
                            </p>
                            <p>Bkash</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone Number</p>
                            <p>{payout.phoneNumber || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Account Holder
                            </p>
                            <p>{payout.accountHolder || "N/A"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CollapsibleCard>

      <RejectReasonModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Write Reject Reason"
        loading={!!selectedItem && loadingId === selectedItem.id}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
};

export default PayoutSettings;