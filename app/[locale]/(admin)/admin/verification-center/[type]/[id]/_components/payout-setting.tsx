import CollapsibleCard from "./collapsible-card";
import { VerificationStatus } from "../../../_components/verification-data";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PayoutSettings {
  id: number;
  type: "Bank Account" | "Bkash";
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
  branchName?: string;
  phoneNumber?: string;
  status: VerificationStatus;
}

interface Props {
  payoutSettings: PayoutSettings[];
}

// const PayoutSettings = ({ payoutSettings }: Props) => {
//   let bankAccountCount = 0;

//   return (
//     <CollapsibleCard heading="Payout Settings">
//       <div className="space-y-3">
//         {payoutSettings.map((payout) => {
//           if (payout.type === "Bank Account") {
//             bankAccountCount += 1;
//           }

//           // Determine button variant for bank accounts
//           let buttonVariant: "lightGreen" | "orange" | "outline" = "outline";

//           if (payout.type === "Bank Account") {
//             buttonVariant = bankAccountCount === 1 ? "lightGreen" : "orange";
//           } else {
//             buttonVariant =
//               payout.status === "Approved" ? "lightGreen" : "outline";
//           }

//           // Determine border and text colors similarly
//           const borderColor =
//             payout.type === "Bank Account"
//               ? bankAccountCount === 1
//                 ? "border-light-green"
//                 : "border-orange"
//               : "border-light-green";

//           const textColor =
//             payout.type === "Bank Account"
//               ? bankAccountCount === 1
//                 ? "text-light-green"
//                 : "text-orange"
//               : "text-light-green";

//           return (
//             <Item
//               key={payout.id}
//               className={`${borderColor} bg-linear-to-r from-white to-Secondary`}
//               variant="outline"
//             >
//               <ItemContent>
//                 {payout.type === "Bank Account" ? (
//                   <>
//                     <ItemTitle className={textColor}>
//                       Bank Account no. {bankAccountCount}
//                     </ItemTitle>
//                     <div>
//                       <p className="text-xs">{payout.bankName}</p>
//                       <p className={cn(textColor, "line-clamp-1")}>
//                         Account No. {payout.accountNumber}
//                       </p>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <ItemTitle className="text-light-green">
//                       {payout.phoneNumber}
//                     </ItemTitle>
//                     <div>
//                       <p className="text-xs">Bkash</p>
//                       <p className="text-light-green">{payout.accountHolder}</p>
//                     </div>
//                   </>
//                 )}
//               </ItemContent>

//               <ItemActions>
//                 <Button variant={buttonVariant} size="sm">
//                   {payout.status}
//                 </Button>
//               </ItemActions>
//             </Item>
//           );
//         })}
//       </div>
//     </CollapsibleCard>
//   );
// };

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
                      <ItemDescription>
                        <p className="text-xs">{payout.bankName}</p>
                        <p className={textClass}>
                          Account No. {payout.accountNumber}
                        </p>
                      </ItemDescription>
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
                      <ItemDescription>
                        <p className="text-xs">Bkash</p>
                        <p className="text-light-green">
                          {payout.accountHolder}
                        </p>
                      </ItemDescription>
                    </div>
                  </div>
                )}
              </ItemContent>

              <ItemActions>
                <Button variant={buttonVariant} size="sm">
                  {payout.status}
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
