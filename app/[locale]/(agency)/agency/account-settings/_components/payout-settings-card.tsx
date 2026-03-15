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
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import {
  createAgencyPayout,
  deleteAgencyPayout,
  getAgencyProfile,
} from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type PayoutSettingsCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

const maskAccountNumber = (value: string) => {
  if (!value) return "-";
  const lastFour = value.slice(-4);
  return `*****-***${lastFour}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const maybeError = error as {
    response?: {
      data?: {
        message?: string | string[];
        error?: string;
      };
    };
    message?: string;
  };

  const message = maybeError?.response?.data?.message;

  if (Array.isArray(message) && message.length > 0) {
    return message[0];
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const responseError = maybeError?.response?.data?.error;
  if (typeof responseError === "string" && responseError.trim()) {
    return responseError;
  }

  if (typeof maybeError?.message === "string" && maybeError.message.trim()) {
    return maybeError.message;
  }

  return fallback;
};

const PayoutSettingsCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: PayoutSettingsCardProps) => {
  const [payoutMethod, setPayoutMethod] = React.useState<string | undefined>();
  const [isCreating, setIsCreating] = React.useState(false);
  const [deletingKey, setDeletingKey] = React.useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const [bankName, setBankName] = React.useState("");
  const [bankAccHolderName, setBankAccHolderName] = React.useState("");
  const [bankAccNo, setBankAccNo] = React.useState("");
  const [bankBranchName, setBankBranchName] = React.useState("");
  const [bankRoutingNo, setBankRoutingNo] = React.useState("");

  const [mobileAccountNo, setMobileAccountNo] = React.useState("");
  const [mobileAccountHolderName, setMobileAccountHolderName] =
    React.useState("");
  const [mobileAccountType, setMobileAccountType] = React.useState("");

  const bankAccounts = profile?.payouts?.bank ?? [];
  const mobileBankingAccounts = profile?.payouts?.mobileBanking ?? [];

  const resetCreateForm = () => {
    setPayoutMethod(undefined);

    setBankName("");
    setBankAccHolderName("");
    setBankAccNo("");
    setBankBranchName("");
    setBankRoutingNo("");

    setMobileAccountNo("");
    setMobileAccountHolderName("");
    setMobileAccountType("");

    setShowCreateForm(false);
  };

  const handleCreatePayout = async () => {
    if (payoutMethod === "bank") {
      if (
        !bankName.trim() ||
        !bankAccHolderName.trim() ||
        !bankAccNo.trim() ||
        !bankBranchName.trim() ||
        !bankRoutingNo.trim()
      ) {
        notifyError("All bank payout fields are required");
        return;
      }

      try {
        setIsCreating(true);

        await createAgencyPayout({
          bank: {
            bankName: bankName.trim(),
            bankAccHolderName: bankAccHolderName.trim(),
            bankAccNo: bankAccNo.trim(),
            bankBranchName: bankBranchName.trim(),
            bankRoutingNo: bankRoutingNo.trim(),
          },
        });

        const refreshedProfile = await getAgencyProfile();
        onProfileUpdated(refreshedProfile);

        resetCreateForm();
        notifySuccess("Payout method added successfully");
      } catch (error) {
        console.error("Failed to create payout method:", error);
        notifyError(getErrorMessage(error, "Failed to create payout method"));
      } finally {
        setIsCreating(false);
      }

      return;
    }

    if (
      payoutMethod === "bkash" ||
      payoutMethod === "nagad" ||
      payoutMethod === "rocket"
    ) {
      if (
        !mobileAccountNo.trim() ||
        !mobileAccountHolderName.trim() ||
        !mobileAccountType.trim()
      ) {
        notifyError("All mobile banking payout fields are required");
        return;
      }

      try {
        setIsCreating(true);

        await createAgencyPayout({
          mobileBanking: {
            accountNo: mobileAccountNo.trim(),
            accountHolderName: mobileAccountHolderName.trim(),
            accountType: mobileAccountType.trim(),
          },
        });

        const refreshedProfile = await getAgencyProfile();
        onProfileUpdated(refreshedProfile);

        resetCreateForm();
        notifySuccess("Payout method added successfully");
      } catch (error) {
        console.error("Failed to create payout method:", error);
        notifyError(getErrorMessage(error, "Failed to create payout method"));
      } finally {
        setIsCreating(false);
      }

      return;
    }

    notifyError("Please select a payout method");
  };

  const handleDeletePayout = async (
    type: "bank" | "mobile",
    identifier: string
  ) => {
    try {
      setDeletingKey(`${type}-${identifier}`);

      const response = await deleteAgencyPayout({
        type,
        identifier,
      });

      const refreshedProfile = await getAgencyProfile();
      onProfileUpdated(refreshedProfile);

      notifySuccess(response.message || "Payout deleted successfully.");
    } catch (error) {
      console.error("Failed to delete payout method:", error);
      notifyError(getErrorMessage(error, "Failed to delete payout method"));
    } finally {
      setDeletingKey(null);
    }
  };

  const getMobileIcon = (accountType: string) => {
    const normalized = accountType.trim().toLowerCase();

    if (normalized === "bkash") return "/icons/bkash-icon.svg";
    if (normalized === "nagad") return "/icons/bkash-icon.svg";
    if (normalized === "rocket") return "/icons/bkash-icon.svg";

    return "/icons/bkash-icon.svg";
  };

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
                      const currentDeleteKey = `bank-${item.bankAccNo}`;
                      const isCurrentDeleting = deletingKey === currentDeleteKey;

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
                                  className={`text-lg font-medium ${isRejected || isPending
                                      ? "text-orange"
                                      : "text-Primary"
                                    }`}
                                >
                                  Bank Account No {index + 1}
                                </h2>
                                <p className="text-xs font-light text-gray-400">
                                  {item.bankName}
                                </p>
                                <p
                                  className={`text-sm ${isRejected || isPending
                                      ? "text-orange"
                                      : "text-Primary"
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
                                  onClick={() =>
                                    void handleDeletePayout("bank", item.bankAccNo)
                                  }
                                  disabled={isCurrentDeleting}
                                >
                                  {isCurrentDeleting ? "Removing..." : "Remove"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {mobileBankingAccounts.map((item, index) => {
                      const currentDeleteKey = `mobile-${item.accountNo}`;
                      const isCurrentDeleting = deletingKey === currentDeleteKey;

                      return (
                        <div
                          key={`mobile-${index}`}
                          className="rounded-lg border border-light-green bg-linear-to-r from-white to-Secondary p-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="relative h-10 w-10">
                                <Image
                                  fill
                                  src={getMobileIcon(item.accountType)}
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
                                className="cursor-pointer bg-light-green hover:bg-light-green/90"
                                type="button"
                                onClick={() =>
                                  void handleDeletePayout("mobile", item.accountNo)
                                }
                                disabled={isCurrentDeleting}
                              >
                                {isCurrentDeleting ? "Removing..." : "Remove"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!bankAccounts.length && !mobileBankingAccounts.length ? (
                      <p className="text-sm text-muted-foreground">
                        No payout methods found.
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              {showCreateForm ? (
                <div>
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-start gap-3 sm:items-center sm:justify-between">
                      <div className="relative h-10 w-10 shrink-0">
                        {payoutMethod === "bkash" ||
                          payoutMethod === "nagad" ||
                          payoutMethod === "rocket" ? (
                          <Image
                            fill
                            src="/icons/bkash-icon.svg"
                            alt="mobile banking icon"
                          />
                        ) : (
                          <Image fill src="/icons/bank-icon.svg" alt="bank icon" />
                        )}
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
                          onClick={() => void handleCreatePayout()}
                          disabled={isCreating}
                          className="cursor-pointer text-light-green"
                        >
                          <TiTick size={26} />
                        </button>
                        <button
                          type="button"
                          onClick={resetCreateForm}
                          disabled={isCreating}
                          className="cursor-pointer text-light-green"
                        >
                          <ImCross size={14} />
                        </button>
                      </div>
                    </div>

                    {payoutMethod === "bank" && (
                      <>
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
                      </>
                    )}

                    {(payoutMethod === "bkash" ||
                      payoutMethod === "nagad" ||
                      payoutMethod === "rocket") && (
                        <>
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
                              onChange={(e) =>
                                setMobileAccountHolderName(e.target.value)
                              }
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
                        </>
                      )}
                  </div>
                </div>
              ) : null}

              <div>
                <Button
                  className="w-full cursor-pointer border border-dashed border-light-green bg-transparent text-Primary hover:bg-light-green hover:text-white"
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={isCreating}
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