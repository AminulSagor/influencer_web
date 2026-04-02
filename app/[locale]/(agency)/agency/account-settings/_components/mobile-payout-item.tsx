"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { AgencyMobileBankingPayoutItem } from "@/types/agency/account-settings";

type MobilePayoutItemProps = {
    item: AgencyMobileBankingPayoutItem;
    index: number;
    isDeleting: boolean;
    onRemove: () => void;
};

const getMobileIcon = (accountType: string) => {
    const normalized = accountType.trim().toLowerCase();

    if (normalized === "bkash") return "/icons/bkash-icon.svg";
    if (normalized === "nagad") return "/icons/nagad-icon.svg";
    if (normalized === "rocket") return "/icons/rocket-icon.svg";

    return "/icons/bkash-icon.svg";
};

const MobilePayoutItem = ({
    item,
    index,
    isDeleting,
    onRemove,
}: MobilePayoutItemProps) => {
    return (
        <div className="rounded-lg border border-light-green bg-linear-to-r from-white to-Secondary p-2">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10">
                        <Image
                            fill
                            sizes="40px"
                            src={getMobileIcon(item.accountType)}
                            alt={`${item.accountType} icon`}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-medium text-Primary">
                            Mobile Banking No {index + 1}
                        </h2>
                        <p className="text-xs font-light text-gray-400">
                            {item.accountType}
                        </p>
                        <p className="text-sm text-Primary">{item.accountHolderName}</p>
                    </div>
                </div>

                <div>
                    <Button
                        className="cursor-pointer bg-light-green hover:bg-light-green/90"
                        type="button"
                        onClick={onRemove}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Removing..." : "Remove"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MobilePayoutItem;