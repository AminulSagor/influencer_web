"use client";

import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type PayoutSettingsCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const maskAccountNumber = (value: string) => {
  if (!value) return "-";
  const lastFour = value.slice(-4);
  return `*****-***${lastFour}`;
};

const PayoutSettingsCard = ({
  profile,
  isLoading,
}: PayoutSettingsCardProps) => {
  const [payoutMethod, setPayoutMethod] = React.useState<string | undefined>();

  const bankAccounts = profile?.payouts?.bank ?? [];
  const mobileBankingAccounts = profile?.payouts?.mobileBanking ?? [];

  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              Payout Settings
            </AccordionTrigger>

            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                  <>
                    {bankAccounts.map((item, index) => {
                      const isRejected = item.accStatus === "rejected";
                      const isPending = item.accStatus === "pending";

                      return (
                        <div
                          key={`bank-${index}`}
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
                                  src={isRejected || isPending ? "/icons/bank-icon-2.svg" : "/icons/bank-icon.svg"}
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
                                <p className="text-xs font-light text-gray-400">
                                  {item.bankName}
                                </p>
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
                                <Button className="bg-orange hover:bg-orange/90" type="button">
                                  {isPending ? "In Review" : "Rejected"}
                                </Button>
                              ) : (
                                <Button
                                  className="bg-light-green hover:bg-light-green/90"
                                  type="button"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {mobileBankingAccounts.map((item, index) => (
                      <div
                        key={`mobile-${index}`}
                        className="rounded-lg border border-light-green bg-linear-to-r from-white to-Secondary p-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="relative h-10 w-10">
                              <Image
                                fill
                                src="/icons/bkash-icon.svg"
                                alt="mobile banking icon"
                              />
                            </div>

                            <div>
                              <h2 className="text-lg font-medium text-Primary">
                                Mobile Banking No {index + 1}
                              </h2>
                              <p className="text-xs font-light text-gray-400">
                                {item.accountType}
                              </p>
                              <p className="text-sm text-Primary">
                                {item.accountHolderName}
                              </p>
                            </div>
                          </div>

                          <div>
                            <Button
                              className="bg-light-green hover:bg-light-green/90"
                              type="button"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!bankAccounts.length && !mobileBankingAccounts.length ? (
                      <p className="text-sm text-muted-foreground">
                        No payout methods found.
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              <div>
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative h-10 w-10">
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

                    <div className="cursor-pointer text-light-green">
                      <TiTick size={26} />
                    </div>
                    <div className="cursor-pointer text-light-green">
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
                <Button
                  className="w-full border border-dashed border-light-green bg-transparent text-Primary hover:bg-light-green hover:text-white"
                  type="button"
                >
                  + Add another Payout Method
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default PayoutSettingsCard;