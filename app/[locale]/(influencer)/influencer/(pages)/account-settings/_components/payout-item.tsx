import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BankAccount, MobileBankingAccount } from "@/types/influencer/profile_type";

interface PayoutItemProps {
  type: "bank" | "mobileBanking";
  data: BankAccount | MobileBankingAccount;
  onRemove?: () => void;
}

export default function PayoutItem({ type, data, onRemove }: PayoutItemProps) {
  const isBank = type === "bank";
  const isMobileBanking = type === "mobileBanking";
  
  // Status-based styling
  const isVerified = data.accStatus === "verified";
  const isPending = data.accStatus === "pending";
  const isRejected = data.accStatus === "rejected";
  
  const borderColor = isVerified 
    ? "border-light-green" 
    : isPending 
    ? "border-orange" 
    : "border-red-500";
    
  const bgColor = isVerified 
    ? "bg-linear-to-r from-white to-Secondary" 
    : isPending 
    ? "bg-linear-to-r from-white to-orange/20" 
    : "bg-linear-to-r from-white to-red-50";
    
  const textColor = isVerified 
    ? "text-Primary" 
    : isPending 
    ? "text-orange" 
    : "text-red-500";
    
  const buttonColor = isVerified 
    ? "bg-light-green hover:bg-light-green/90" 
    : isPending 
    ? "bg-orange hover:bg-orange/90" 
    : "bg-red-500 hover:bg-red-500/90";

  // Get icon based on type
  const getIcon = () => {
    if (isBank) return "/icons/bank-icon.svg";
    if (isMobileBanking) {
      const mobileData = data as MobileBankingAccount;
      if (mobileData.accountType.toLowerCase().includes("bkash")) {
        return "/icons/bkash-icon.svg";
      }
      return "/icons/bank-icon.svg"; // fallback
    }
    return "/icons/bank-icon.svg";
  };

  // Get display name
  const getName = () => {
    if (isBank) {
      const bankData = data as BankAccount;
      return bankData.bankName;
    }
    if (isMobileBanking) {
      const mobileData = data as MobileBankingAccount;
      return mobileData.accountType;
    }
    return "";
  };

  // Get subtitle
  const getSubtitle = () => {
    if (isBank) {
      const bankData = data as BankAccount;
      return bankData.bankBranchName;
    }
    if (isMobileBanking) {
      const mobileData = data as MobileBankingAccount;
      return mobileData.accountHolderName;
    }
    return "";
  };

  // Get account details
  const getAccountDetails = () => {
    if (isBank) {
      const bankData = data as BankAccount;
      const masked = bankData.bankAccNo.slice(-4).padStart(bankData.bankAccNo.length, "*");
      return `Account Number: ${masked}`;
    }
    if (isMobileBanking) {
      const mobileData = data as MobileBankingAccount;
      const masked = mobileData.accountNo.slice(-4).padStart(mobileData.accountNo.length, "*");
      return `Number: ${masked}`;
    }
    return "";
  };

  // Get button text
  const getButtonText = () => {
    if (isVerified) return "Remove";
    if (isPending) return "In Review";
    if (isRejected) return "Rejected";
    return "Remove";
  };

  return (
    <div className={`border rounded-lg p-2 ${borderColor} ${bgColor}`}>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image fill src={getIcon()} alt={`${getName()} icon`} />
          </div>
          <div>
            <h2 className={`font-medium text-lg ${textColor}`}>
              {getName()}
            </h2>
            <p className="text-xs font-light text-gray-400">{getSubtitle()}</p>
            <p className={`text-sm ${textColor}`}>
              {getAccountDetails()}
            </p>
          </div>
        </div>
        <div>
          <Button 
            className={buttonColor}
            onClick={onRemove}
            disabled={isPending}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
}
