"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import {
  createAgencyPayout,
  deleteAgencyPayout,
} from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import BankPayoutItem from "./bank-payout-item";
import MobilePayoutItem from "./mobile-payout-item";
import BankPayoutForm from "./bank-payout-form";
import MobilePayoutForm from "./mobile-payout-form";

type PayoutSettingsCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
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
    if (!profile) return;

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

        const updatedProfile = await createAgencyPayout({
          bank: {
            bankName: bankName.trim(),
            bankAccHolderName: bankAccHolderName.trim(),
            bankAccNo: bankAccNo.trim(),
            bankBranchName: bankBranchName.trim(),
            bankRoutingNo: bankRoutingNo.trim(),
          },
        });

        const mergedProfile: AgencyProfileResponse = {
          ...profile,
          ...updatedProfile,
          payouts: {
            ...profile.payouts,
            ...updatedProfile.payouts,
            bank: updatedProfile.payouts?.bank ?? profile.payouts.bank,
            mobileBanking:
              updatedProfile.payouts?.mobileBanking ??
              profile.payouts.mobileBanking,
          },
        };

        onProfileUpdated(mergedProfile);
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

        const updatedProfile = await createAgencyPayout({
          mobileBanking: {
            accountNo: mobileAccountNo.trim(),
            accountHolderName: mobileAccountHolderName.trim(),
            accountType: mobileAccountType.trim(),
          },
        });

        const mergedProfile: AgencyProfileResponse = {
          ...profile,
          ...updatedProfile,
          payouts: {
            ...profile.payouts,
            ...updatedProfile.payouts,
            bank: updatedProfile.payouts?.bank ?? profile.payouts.bank,
            mobileBanking:
              updatedProfile.payouts?.mobileBanking ??
              profile.payouts.mobileBanking,
          },
        };

        onProfileUpdated(mergedProfile);
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

  const handleDeletePayout = async (type: "bank" | "mobile", id: string) => {
    if (!profile) return;

    try {
      setDeletingKey(`${type}-${id}`);

      const response = await deleteAgencyPayout({
        type,
        id,
      });

      const updatedProfile: AgencyProfileResponse = {
        ...profile,
        payouts: {
          ...profile.payouts,
          bank:
            type === "bank"
              ? profile.payouts.bank.filter((item) => item.id !== id)
              : profile.payouts.bank,
          mobileBanking:
            type === "mobile"
              ? profile.payouts.mobileBanking.filter((item) => item.id !== id)
              : profile.payouts.mobileBanking,
        },
      };

      onProfileUpdated(updatedProfile);
      notifySuccess(response.message || "Payout deleted successfully.");
    } catch (error) {
      console.error("Failed to delete payout method:", error);
      notifyError(getErrorMessage(error, "Failed to delete payout method"));
    } finally {
      setDeletingKey(null);
    }
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
                    {bankAccounts.map((item, index) => (
                      <BankPayoutItem
                        key={`bank-${item.id}`}
                        item={item}
                        index={index}
                        isDeleting={deletingKey === `bank-${item.id}`}
                        onRemove={() => void handleDeletePayout("bank", item.id)}
                      />
                    ))}

                    {mobileBankingAccounts.map((item, index) => (
                      <MobilePayoutItem
                        key={`mobile-${item.id}`}
                        item={item}
                        index={index}
                        isDeleting={deletingKey === `mobile-${item.id}`}
                        onRemove={() => void handleDeletePayout("mobile", item.id)}
                      />
                    ))}

                    {!bankAccounts.length && !mobileBankingAccounts.length ? (
                      <p className="text-sm text-muted-foreground">
                        No payout methods found.
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              {showCreateForm ? (
                payoutMethod === "bank" ? (
                  <BankPayoutForm
                    payoutMethod={payoutMethod}
                    setPayoutMethod={setPayoutMethod}
                    bankName={bankName}
                    setBankName={setBankName}
                    bankAccHolderName={bankAccHolderName}
                    setBankAccHolderName={setBankAccHolderName}
                    bankAccNo={bankAccNo}
                    setBankAccNo={setBankAccNo}
                    bankBranchName={bankBranchName}
                    setBankBranchName={setBankBranchName}
                    bankRoutingNo={bankRoutingNo}
                    setBankRoutingNo={setBankRoutingNo}
                    mobileAccountType={mobileAccountType}
                    setMobileAccountType={setMobileAccountType}
                    isCreating={isCreating}
                    onSave={() => void handleCreatePayout()}
                    onCancel={resetCreateForm}
                  />
                ) : (
                  <MobilePayoutForm
                    payoutMethod={payoutMethod}
                    setPayoutMethod={setPayoutMethod}
                    mobileAccountNo={mobileAccountNo}
                    setMobileAccountNo={setMobileAccountNo}
                    mobileAccountHolderName={mobileAccountHolderName}
                    setMobileAccountHolderName={setMobileAccountHolderName}
                    mobileAccountType={mobileAccountType}
                    setMobileAccountType={setMobileAccountType}
                    isCreating={isCreating}
                    onSave={() => void handleCreatePayout()}
                    onCancel={resetCreateForm}
                  />
                )
              ) : null}

              <div>
                <Button
                  className="w-full cursor-pointer border border-dashed border-light-green bg-transparent text-Primary hover:bg-light-green hover:text-white"
                  type="button"
                  onClick={() => {
                    setShowCreateForm(true);
                    setPayoutMethod(undefined);
                  }}
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