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

type BankPayoutFormProps = {
    payoutMethod?: string;
    setPayoutMethod: (value: string) => void;
    bankName: string;
    setBankName: (value: string) => void;
    bankAccHolderName: string;
    setBankAccHolderName: (value: string) => void;
    bankAccNo: string;
    setBankAccNo: (value: string) => void;
    bankBranchName: string;
    setBankBranchName: (value: string) => void;
    bankRoutingNo: string;
    setBankRoutingNo: (value: string) => void;
    mobileAccountType: string;
    setMobileAccountType: (value: string) => void;
    isCreating: boolean;
    onSave: () => void;
    onCancel: () => void;
};

const BankPayoutForm = ({
    payoutMethod,
    setPayoutMethod,
    bankName,
    setBankName,
    bankAccHolderName,
    setBankAccHolderName,
    bankAccNo,
    setBankAccNo,
    bankBranchName,
    setBankBranchName,
    bankRoutingNo,
    setBankRoutingNo,
    setMobileAccountType,
    isCreating,
    onSave,
    onCancel,
}: BankPayoutFormProps) => {
    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-start gap-3 sm:items-center sm:justify-between">
                <div className="relative h-10 w-10 shrink-0">
                    <Image fill sizes="40px" src="/icons/bank-icon.svg" alt="bank icon" />
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
                <Label>Bank Name</Label>
                <Input
                    placeholder="Enter Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    disabled={isCreating}
                />
            </div>

            <div className="space-y-1">
                <Label>Bank Account Holder Name</Label>
                <Input
                    placeholder="Enter Account Holder Name"
                    value={bankAccHolderName}
                    onChange={(e) => setBankAccHolderName(e.target.value)}
                    disabled={isCreating}
                />
            </div>

            <div className="space-y-1">
                <Label>Bank Account No</Label>
                <Input
                    placeholder="Enter Bank Account No."
                    value={bankAccNo}
                    onChange={(e) => setBankAccNo(e.target.value)}
                    disabled={isCreating}
                />
            </div>

            <div className="space-y-1">
                <Label>Bank Branch Name</Label>
                <Input
                    placeholder="Enter Branch Name"
                    value={bankBranchName}
                    onChange={(e) => setBankBranchName(e.target.value)}
                    disabled={isCreating}
                />
            </div>

            <div className="space-y-1">
                <Label>Routing Number</Label>
                <Input
                    placeholder="Enter Routing Number"
                    value={bankRoutingNo}
                    onChange={(e) => setBankRoutingNo(e.target.value)}
                    disabled={isCreating}
                />
            </div>
        </div>
    );
};

export default BankPayoutForm;