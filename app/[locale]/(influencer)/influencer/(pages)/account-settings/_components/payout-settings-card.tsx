"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
import { getInfluencerProfile } from "@/service/influencer/profile/profile";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";
import PayoutItem from "./payout-item";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bankPayoutSchema,
  mobileBankingPayoutSchema,
  BankPayoutFormData,
  MobileBankingPayoutFormData,
} from "@/schemas/influencer/payout-validation";
import { addBankPayout, addMobileBankingPayout, deletePayout } from "@/service/influencer/payout/payout";
import { notifySuccess, notifyError } from "@/utils/toast_util";

const PayoutSettingsCard = () => {
  const [payoutMethod, setPayoutMethod] = React.useState<string | undefined>();
  const [profileData, setProfileData] = useState<InfluencerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const t = useTranslations("influencer.account-setting");

  // Bank form
  const {
    register: registerBank,
    handleSubmit: handleSubmitBank,
    formState: { errors: errorsBank },
    reset: resetBank,
  } = useForm<BankPayoutFormData>({
    resolver: zodResolver(bankPayoutSchema),
  });

  // Mobile banking form
  const {
    register: registerMobile,
    handleSubmit: handleSubmitMobile,
    formState: { errors: errorsMobile },
    reset: resetMobile,
  } = useForm<MobileBankingPayoutFormData>({
    resolver: zodResolver(mobileBankingPayoutSchema),
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getInfluencerProfile();
      setProfileData(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      notifyError("Failed to load payout methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmitBank = async (data: BankPayoutFormData) => {
    try {
      setIsSubmitting(true);
      await addBankPayout({ bank: data });
      notifySuccess("Bank account added successfully");
      resetBank();
      setPayoutMethod(undefined);
      setShowForm(false);
      await fetchProfile(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to add bank account:", error);
      notifyError(error?.response?.data?.message || "Failed to add bank account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitMobileBanking = async (data: MobileBankingPayoutFormData) => {
    try {
      setIsSubmitting(true);
      await addMobileBankingPayout({ mobileBanking: data });
      notifySuccess("Mobile banking account added successfully");
      resetMobile();
      setPayoutMethod(undefined);
      setShowForm(false);
      await fetchProfile(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to add mobile banking:", error);
      notifyError(error?.response?.data?.message || "Failed to add mobile banking account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetBank();
    resetMobile();
    setPayoutMethod(undefined);
    setShowForm(false);
  };

  const handleAddNewClick = () => {
    if (showForm) {
      handleCancel();
    } else {
      setShowForm(true);
    }
  };

  const handleDelete = async (type: "bank" | "mobileBanking", identifier: string, accountName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove this ${type === "bank" ? "bank account" : "mobile banking account"} (${accountName})?`
    );
    
    if (!confirmed) return;

    try {
      // Map mobileBanking to mobile for API
      const apiType = type === "mobileBanking" ? "mobile" : "bank";
      await deletePayout({ type: apiType, identifier });
      notifySuccess("Payment method removed successfully");
      await fetchProfile(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to delete payout method:", error);
      notifyError(error?.response?.data?.message || "Failed to remove payment method");
    }
  };

  // Update account type when mobile banking method is selected
  useEffect(() => {
    if (payoutMethod && payoutMethod !== "bank") {
      const capitalizedType = payoutMethod.charAt(0).toUpperCase() + payoutMethod.slice(1);
      resetMobile({ accountType: capitalizedType });
    }
  }, [payoutMethod, resetMobile]);

  return (
    <CollapseCard title={t("Payout Settings")}>
      <div className="space-y-4">
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading payout methods...</div>
          ) : (
            <>
              {/* Render bank accounts */}
              {profileData?.payouts?.bank?.map((bankAccount, index) => (
                <PayoutItem
                  key={`bank-${index}`}
                  type="bank"
                  data={bankAccount}
                  onRemove={() => handleDelete("bank", bankAccount.bankAccNo, bankAccount.bankName)}
                />
              ))}

              {/* Render mobile banking accounts */}
              {profileData?.payouts?.mobileBanking?.map((mobileAccount, index) => (
                <PayoutItem
                  key={`mobile-${index}`}
                  type="mobileBanking"
                  data={mobileAccount}
                  onRemove={() => handleDelete("mobileBanking", mobileAccount.accountNo, mobileAccount.accountType)}
                />
              ))}

              {/* Show message if no payout methods */}
              {(!profileData?.payouts?.bank?.length && !profileData?.payouts?.mobileBanking?.length) && (
                <div className="text-center py-4 text-gray-500">
                  No payout methods added yet
                </div>
              )}
            </>
          )}
        </div>

        {showForm && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-10 h-10">
                {payoutMethod === "bkash" || payoutMethod === "nagad" || payoutMethod === "rocket" ? (
                  <Image fill src="/icons/bkash-icon.svg" alt="mobile banking icon" />
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

              <div 
                className="text-light-green hover:cursor-pointer"
                onClick={() => {
                  if (!payoutMethod) {
                    notifyError("Please select a payout method");
                    return;
                  }
                  if (payoutMethod === "bank") {
                    handleSubmitBank(onSubmitBank)();
                  } else {
                    handleSubmitMobile(onSubmitMobileBanking)();
                  }
                }}
              >
                <TiTick size={26} />
              </div>
              <div 
                className="text-light-green hover:cursor-pointer"
                onClick={handleCancel}
              >
                <ImCross />
              </div>
            </div>

            {payoutMethod === "bank" && (
              <form onSubmit={handleSubmitBank(onSubmitBank)}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label>Bank Name</Label>
                    <Input 
                      placeholder="Enter Bank Name" 
                      {...registerBank("bankName")}
                    />
                    {errorsBank.bankName && (
                      <p className="text-xs text-red-500">{errorsBank.bankName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Bank Account Holder Name</Label>
                    <Input 
                      placeholder="Enter Account Holder Name" 
                      {...registerBank("bankAccHolderName")}
                    />
                    {errorsBank.bankAccHolderName && (
                      <p className="text-xs text-red-500">{errorsBank.bankAccHolderName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Bank Account No</Label>
                    <Input 
                      placeholder="Enter Bank Account No." 
                      {...registerBank("bankAccNo")}
                    />
                    {errorsBank.bankAccNo && (
                      <p className="text-xs text-red-500">{errorsBank.bankAccNo.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Branch Name</Label>
                    <Input 
                      placeholder="Enter Branch Name" 
                      {...registerBank("bankBranchName")}
                    />
                    {errorsBank.bankBranchName && (
                      <p className="text-xs text-red-500">{errorsBank.bankBranchName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Routing Number</Label>
                    <Input 
                      placeholder="Enter Routing Number" 
                      {...registerBank("bankRoutingNo")}
                    />
                    {errorsBank.bankRoutingNo && (
                      <p className="text-xs text-red-500">{errorsBank.bankRoutingNo.message}</p>
                    )}
                  </div>
                </div>
              </form>
            )}

            {(payoutMethod === "bkash" || payoutMethod === "nagad" || payoutMethod === "rocket") && (
              <form onSubmit={handleSubmitMobile(onSubmitMobileBanking)}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label>Account Type</Label>
                    <Input 
                      value={payoutMethod?.charAt(0).toUpperCase() + payoutMethod?.slice(1) || ""}
                      {...registerMobile("accountType")}
                      readOnly
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Mobile Number</Label>
                    <Input 
                      placeholder="Enter Mobile Number" 
                      {...registerMobile("accountNo")}
                    />
                    {errorsMobile.accountNo && (
                      <p className="text-xs text-red-500">{errorsMobile.accountNo.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>Account Holder Name</Label>
                    <Input 
                      placeholder="Enter Holder Name" 
                      {...registerMobile("accountHolderName")}
                    />
                    {errorsMobile.accountHolderName && (
                      <p className="text-xs text-red-500">{errorsMobile.accountHolderName.message}</p>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        <div>
          <Button 
            className="w-full bg-transparent border border-dashed border-light-green hover:bg-light-green hover:text-white text-Primary"
            onClick={handleAddNewClick}
            disabled={isSubmitting}
            type="button"
          >
            {showForm ? "Cancel" : t("Add another Payout Method")}
          </Button>
        </div>
      </div>
    </CollapseCard>
  );
};

export default PayoutSettingsCard;
