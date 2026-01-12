import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface PayoutSettings {
  id: number;
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
  payoutSettings: PayoutSettings[];
}

const PayoutSettings = ({ payoutSettings }: Props) => {
  let bankAccountCount = 0;

  return (
    <CollapsibleCard heading="Payout Settings">
      <div className="space-y-3">
        {payoutSettings.map((payout) => {
          if (payout.type === "Bank Account") {
            bankAccountCount += 1;
          }

          const isFirstBank =
            payout.type === "Bank Account" && bankAccountCount === 1;
          const isSecondOrMoreBank =
            payout.type === "Bank Account" && bankAccountCount > 1;

          // Border & Background classes
          const borderClass = isSecondOrMoreBank
            ? "border-orange"
            : "border-light-green";

          const bgClass = isSecondOrMoreBank
            ? "bg-gradient-to-r from-white to-orange/20"
            : "bg-linear-to-r from-white to-Secondary";

          // Text color class
          const textClass = isSecondOrMoreBank
            ? "text-orange"
            : "text-light-green";

          // Button variant
          const buttonVariant =
            payout.type === "Bank Account"
              ? isFirstBank
                ? "lightGreen"
                : "orange"
              : payout.status === "Approved"
              ? "lightGreen"
              : "outline";

          return (
            <Item
              key={payout.id}
              className={`border ${borderClass} ${bgClass}`}
              variant="outline"
            >
              <ItemContent>
                {payout.type === "Bank Account" ? (
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="relative w-10 aspect-square">
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
                    <div>
                      <ItemTitle className={textClass}>
                        Bank Account no. {bankAccountCount}
                      </ItemTitle>
                      <div>
                        <p className="text-xs text-gray-400">
                          {payout.bankName}
                        </p>
                        <p className={cn(textClass, "line-clamp-1")}>
                          Account No. {payout.accountNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="relative w-8 aspect-square">
                        <Image
                          className="object-contain"
                          src={"/icons/bkash-icon.svg"}
                          fill
                          alt="Bank"
                        />
                      </div>
                    </div>
                    <div>
                      <ItemTitle className="text-light-green">
                        {payout.phoneNumber}
                      </ItemTitle>
                      <div>
                        <p className="text-xs text-gray-400">Bkash</p>
                        <p className="text-light-green">
                          {payout.accountHolder}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </ItemContent>

              <ItemActions>
                <Button variant={buttonVariant} size="sm">
                  View
                </Button>
              </ItemActions>
            </Item>
          );
        })}
      </div>
    </CollapsibleCard>
  );
};

export default PayoutSettings;
