"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";

type MobilePayoutFormProps = {
    payoutMethod?: string;
    setPayoutMethod: (value: string) => void;
    mobileAccountNo: string;
    setMobileAccountNo: (value: string) => void;
    mobileAccountHolderName: string;
    setMobileAccountHolderName: (value: string) => void;
    mobileAccountType: string;
    setMobileAccountType: (value: string) => void;
    isCreating: boolean;
    onSave: () => void;
    onCancel: () => void;
};

const MobilePayoutForm = ({
    payoutMethod,
    setPayoutMethod,
    mobileAccountNo,
    setMobileAccountNo,
    mobileAccountHolderName,
    setMobileAccountHolderName,
    mobileAccountType,
    setMobileAccountType,
    isCreating,
    onSave,
    onCancel,
}: MobilePayoutFormProps) => {
    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-start gap-3 sm:items-center sm:justify-between">
                <div className="relative h-10 w-10 shrink-0">
                    <Image
                        fill
                        sizes="40px"
                        src="/icons/bkash-icon.svg"
                        alt="mobile banking icon"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <Select
                        value={payoutMethod}
                        onValueChange={(value) => {
                            setPayoutMethod(value);

                            if (value === "bkash") {
                                setMobileAccountType("Bkash");
                            } else if (value === "nagad") {
                                setMobileAccountType("Nagad");
                            } else if (value === "rocket") {
                                setMobileAccountType("Rocket");
                            } else {
                                setMobileAccountType("");
                            }
                        }}
                        disabled={isCreating}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payout method" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="bank">Bank</SelectItem>
                            <SelectItem value="bkash">bKash</SelectItem>
                            <SelectItem value="nagad">Nagad</SelectItem>
                            <SelectItem value="rocket">Rocket</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-center sm:self-auto">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isCreating}
                        className="cursor-pointer text-light-green"
                    >
                        <TiTick size={26} />
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isCreating}
                        className="cursor-pointer text-light-green"
                    >
                        <ImCross size={14} />
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <Label>
                    {payoutMethod === "bkash"
                        ? "bKash No"
                        : payoutMethod === "nagad"
                            ? "Nagad No"
                            : "Rocket No"}
                </Label>
                <Input
                    placeholder={`Enter ${payoutMethod === "bkash"
                            ? "bKash"
                            : payoutMethod === "nagad"
                                ? "Nagad"
                                : "Rocket"
                        } Number`}
                    value={mobileAccountNo}
                    onChange={(e) => setMobileAccountNo(e.target.value)}
                    disabled={isCreating}
                />
            </div>

            <div className="space-y-1">
                <Label>
                    {payoutMethod === "bkash"
                        ? "bKash Holder Name"
                        : payoutMethod === "nagad"
                            ? "Nagad Holder Name"
                            : "Rocket Holder Name"}
                </Label>
                <Input
                    placeholder="Enter Holder Name"
                    value={mobileAccountHolderName}
                    onChange={(e) => setMobileAccountHolderName(e.target.value)}
                    disabled={isCreating}
                />
            </div>

            <div className="space-y-1">
                <Label>
                    {payoutMethod === "bkash"
                        ? "bKash Account Type"
                        : payoutMethod === "nagad"
                            ? "Nagad Account Type"
                            : "Rocket Account Type"}
                </Label>
                <Input
                    placeholder="Enter Account Type"
                    value={mobileAccountType}
                    onChange={(e) => setMobileAccountType(e.target.value)}
                    disabled={isCreating}
                />
            </div>
        </div>
    );
};

export default MobilePayoutForm;