"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";

const PayoutSettingsCard = () => {
  const [payoutMethod, setPayoutMethod] = React.useState<string | undefined>();

  return (
    <CollapseCard title="Payout settigns">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="border rounded-lg p-2 border-light-green bg-linear-to-r from-white to-Secondary">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image fill src={"/icons/bank-icon.svg"} alt="bank icon" />
                </div>
                <div>
                  <h2 className="font-medium text-Primary text-lg">
                    Bank Account No 1
                  </h2>
                  <p className="text-xs font-light text-gray-400">DBBL</p>
                  <p className="text-Primary text-sm">
                    Acount Number: *****-***989
                  </p>
                </div>
              </div>
              <div>
                <Button className="bg-light-green hover:bg-light-green/90">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-2 border-light-green bg-linear-to-r from-white to-Secondary">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image fill src="/icons/bkash-icon.svg" alt="bkash icon" />
                </div>
                <div>
                  <h2 className="font-medium text-Primary text-lg">
                    Bank Account No 1
                  </h2>
                  <p className="text-xs font-light text-gray-400">Bkash</p>
                  <p className="text-Primary text-sm">Hania Amir</p>
                </div>
              </div>
              <div>
                <Button className="bg-light-green hover:bg-light-green/90">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-2 border-orange bg-linear-to-r from-white to-orange/20">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image fill src={"/icons/bank-icon-2.svg"} alt="bank icon" />
                </div>
                <div>
                  <h2 className="font-medium text-orange text-lg">
                    Bank Account No 1
                  </h2>
                  <p className="text-xs font-light text-gray-400">DBBL</p>
                  <p className="text-orange text-sm">
                    Acount Number: *****-***989
                  </p>
                </div>
              </div>
              <div>
                <Button className="bg-orange hover:bg-light-orange/90">
                  In Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-10 h-10">
                {payoutMethod === "bkash" ? (
                  <Image fill src="/icons/bkash-icon.svg" alt="bkash icon" />
                ) : (
                  <Image fill src="/icons/bank-icon.svg" alt="bank icon" />
                )}
              </div>
              <div className="flex-1">
                <Select value={payoutMethod} onValueChange={setPayoutMethod}>
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

              <div className="text-light-green hover:cursor-pointer">
                <TiTick size={26} />
              </div>
              <div className="text-light-green hover:cursor-pointer">
                <ImCross />
              </div>
            </div>

            {payoutMethod === "bank" && (
              <>
                <div className="space-y-1">
                  <Label>Bank Name</Label>
                  <Input placeholder="Enter Bank Name" />
                </div>

                <div className="space-y-1">
                  <Label>Bank Account Holder Name</Label>
                  <Input placeholder="Enter Account Holder Name" />
                </div>

                <div className="space-y-1">
                  <Label>Bank Account No</Label>
                  <Input placeholder="Enter Bank Account No." />
                </div>

                <div className="space-y-1">
                  <Label>Routing Number</Label>
                  <Input placeholder="Enter Routing Number" />
                </div>
              </>
            )}

            {payoutMethod === "bkash" && (
              <>
                <div className="space-y-1">
                  <Label>bKash No</Label>
                  <Input placeholder="Enter bKash Number" />
                </div>

                <div className="space-y-1">
                  <Label>bKash Holder Name</Label>
                  <Input placeholder="Enter Holder Name" />
                </div>

                <div className="space-y-1">
                  <Label>bKash Account Type</Label>
                  <Input placeholder="Enter Account Type" />
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <Button className="w-full bg-transparent border border-dashed border-light-green hover:bg-light-green hover:text-white text-Primary">
            + Add another Payout Method
          </Button>
        </div>
      </div>
    </CollapseCard>
  );
};

export default PayoutSettingsCard;
