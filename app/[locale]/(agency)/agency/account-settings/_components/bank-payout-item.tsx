"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AgencyBankPayoutItem } from "@/types/agency/account-settings";

type BankPayoutItemProps = {
    item: AgencyBankPayoutItem;
    index: number;
    isDeleting: boolean;
    onRemove: () => void;
};

const maskAccountNumber = (value: string) => {
    if (!value) return "-";
    const lastFour = value.slice(-4);
    return `*****-***${lastFour}`;
};

const BankPayoutItem = ({
    item,
    index,
    isDeleting,
    onRemove,
}: BankPayoutItemProps) => {
    const isRejected = item.accStatus === "rejected";
    const isPending = item.accStatus === "pending";

    return (
        <div
            className={`rounded-lg border p-2 ${isRejected || isPending
                    ? "border-orange bg-linear-to-r from-white to-orange/20"
                    : "border-light-green bg-linear-to-r from-white to-Secondary"
                }`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10">
                        <Image
                            fill
                            sizes="40px"
                            src={
                                isRejected || isPending
                                    ? "/icons/bank-icon-2.svg"
                                    : "/icons/bank-icon.svg"
                            }
                            alt="bank icon"
                        />
                    </div>

                    <div>
                        <h2
                            className={`text-lg font-medium ${isRejected || isPending ? "text-orange" : "text-Primary"
                                }`}
                        >
                            Bank Account No {index + 1}
                        </h2>
                        <p className="text-xs font-light text-gray-400">{item.bankName}</p>
                        <p
                            className={`text-sm ${isRejected || isPending ? "text-orange" : "text-Primary"
                                }`}
                        >
                            Account Number: {maskAccountNumber(item.bankAccNo)}
                        </p>
                    </div>
                </div>

                <div>
                    {isRejected || isPending ? (
                        <Button
                            className="cursor-pointer bg-orange hover:bg-orange/90"
                            type="button"
                        >
                            {isPending ? "In Review" : "Rejected"}
                        </Button>
                    ) : (
                        <Button
                            className="cursor-pointer bg-light-green hover:bg-light-green/90"
                            type="button"
                            onClick={onRemove}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Removing..." : "Remove"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankPayoutItem;