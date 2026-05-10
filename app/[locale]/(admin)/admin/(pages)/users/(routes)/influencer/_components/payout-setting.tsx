"use client";

import { useMemo, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface PayoutSettingsItem {
  id: string;
  type: "Bank Account" | "Bkash";
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
  branchName?: string;
  phoneNumber?: string;
  status: string;
}

interface Props {
  payoutSettings?: PayoutSettingsItem[];
}

const maskAccountNumber = (value?: string) => {
  if (!value) return "******";
  const lastFour = value.slice(-4);
  return `******${lastFour}`;
};

const PayoutSettings = ({ payoutSettings = [] }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bankIndexMap = useMemo(() => {
    let bankCount = 0;
    return payoutSettings.reduce<Record<string, number>>((acc, payout) => {
      if (payout.type === "Bank Account") {
        bankCount += 1;
        acc[payout.id] = bankCount;
      }
      return acc;
    }, {});
  }, [payoutSettings]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="h-full [&>div]:h-full">
      <CollapsibleCard heading="Payout Settings">
      <div className="space-y-3">
        {payoutSettings.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3">
            No payout settings available
          </div>
        ) : (
          payoutSettings.map((payout) => {
            const bankSerial = bankIndexMap[payout.id];
            const isBank = payout.type === "Bank Account";
            const isExpanded = expandedId === payout.id;
            const isFirstBank = isBank && bankSerial === 1;
            const isSecondOrMoreBank = isBank && bankSerial > 1;

            const borderClass = isSecondOrMoreBank
              ? "border-orange/50"
              : "border-light-green";

            const bgClass = isSecondOrMoreBank
              ? "bg-white"
              : "bg-linear-to-r from-white to-Secondary";

            const textClass = isSecondOrMoreBank
              ? "text-orange"
              : "text-light-green";

            const buttonVariant =
              payout.type === "Bank Account"
                ? isFirstBank
                  ? "lightGreen"
                  : "orange"
                : payout.status?.toLowerCase() === "approved"
                ? "lightGreen"
                : "outline";

            return (
              <div
                key={payout.id}
                className={cn(
                  "rounded-xl border overflow-hidden",
                  borderClass,
                  bgClass
                )}
              >
                <Item className="border-0 shadow-none bg-transparent" variant="outline">
                  <ItemContent>
                    {isBank ? (
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 shrink-0">
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

                        <div>
                          <ItemTitle className={cn("font-medium", textClass)}>
                            Bank Account No.{bankSerial}
                          </ItemTitle>

                          <div>
                            <p className="text-xs text-gray-400">
                              {payout.bankName || "Bank"}
                            </p>
                            <p className={cn("text-sm", textClass)}>
                              Account No: {maskAccountNumber(payout.accountNumber)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 shrink-0">
                          <Image
                            className="object-contain"
                            src="/icons/bkash-icon.svg"
                            fill
                            alt="Bkash"
                          />
                        </div>

                        <div>
                          <ItemTitle className="text-light-green font-medium">
                            {payout.phoneNumber || "N/A"}
                          </ItemTitle>
                          <div>
                            <p className="text-xs text-gray-400">
                              {payout.type || "Mobile Banking"}
                            </p>
                            <p className="text-sm text-light-green">
                              {payout.accountHolder || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </ItemContent>

                  <ItemActions>
                    <Button
                      variant={buttonVariant}
                      size="sm"
                      onClick={() => toggleExpand(payout.id)}
                      className="min-w-[84px]"
                    >
                      {isExpanded ? "Hide" : "View"}
                    </Button>
                  </ItemActions>
                </Item>

                {isExpanded && (
                  <div className="border-t border-gray-200 px-5 py-4 bg-white">
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(payout.id)}
                        className="text-Primary"
                      >
                        <ChevronUp size={18} />
                      </button>
                    </div>

                    {isBank ? (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Bank Name</p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.bankName || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Bank Account Holder Name
                          </p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.accountHolder || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Bank Account No</p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.accountNumber || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Routing Number</p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.routingNumber || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Branch Name</p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.branchName || "N/A"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Account Type</p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.type || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">
                            Account Holder Name
                          </p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.accountHolder || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                          <p className="text-light-green text-xl font-medium">
                            {payout.phoneNumber || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Status</p>
                          <p className="text-light-green text-xl font-medium capitalize">
                            {payout.status || "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </CollapsibleCard>
    </div>
  );
};

export default PayoutSettings;