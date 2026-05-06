"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type VerifyEmailOtpPayload = {
  email: string;
  code: string;
};

type EmailVerificationDialogProps = {
  open: boolean;
  email: string;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  verifyOtp: (payload: VerifyEmailOtpPayload) => Promise<unknown>;
};

export function EmailVerificationDialog({
  open,
  email,
  onOpenChange,
  onVerified,
  verifyOtp,
}: EmailVerificationDialogProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!email || !code.trim()) {
      toast.error("Please enter verification code");
      return;
    }

    try {
      setIsVerifying(true);

      await verifyOtp({
        email,
        code: code.trim(),
      });

      toast.success("Email verified successfully");
      setCode("");
      onVerified();
      onOpenChange(false);
    } catch (error) {
      toast.error("Invalid or expired verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-32px)] max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-base">Verify Email</DialogTitle>
          <DialogDescription className="text-sm">
            We sent a verification code to your email. Enter the code below to
            verify your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              value={email}
              disabled
              className="h-10 w-full rounded-md border bg-gray-100 px-3 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Verification Code
            </label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter code"
              className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-light-green"
            />
          </div>

          <Button
            type="button"
            disabled={isVerifying}
            onClick={handleVerify}
            className="w-full bg-light-green text-white hover:bg-light-green/90"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
