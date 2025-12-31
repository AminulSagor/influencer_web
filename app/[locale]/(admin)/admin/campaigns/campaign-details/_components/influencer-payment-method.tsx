"use client";
import { useState } from "react";
import CollapsibleCard from "./collapsible-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PaymentMethodBank = {
  type: "bank";
  bankName: string;
  accountNumber: string;
};

type PaymentMethodWallet = {
  type: "mobile_wallet";
  walletName: string;
  phoneNumber: string;
};

type PaymentMethod = PaymentMethodBank | PaymentMethodWallet;

type Influencer = {
  id: number;
  name: string;
  paymentMethods: PaymentMethod[];
  avatarUrl?: string;
};

const influencersData: Influencer[] = [
  {
    id: 1,
    name: "John Doe",
    avatarUrl: "/avatars/john-doe.jpg",
    paymentMethods: [
      { type: "bank", bankName: "Bank A", accountNumber: "1234567890" },
      {
        type: "mobile_wallet",
        walletName: "Bkash",
        phoneNumber: "017XXXXXXXX",
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatarUrl: "/avatars/jane-smith.jpg",
    paymentMethods: [
      { type: "bank", bankName: "Bank B", accountNumber: "9876543210" },
    ],
  },
  {
    id: 3,
    name: "Alice Johnson",
    avatarUrl: "/avatars/alice-johnson.jpg",
    paymentMethods: [
      {
        type: "mobile_wallet",
        walletName: "Nagad",
        phoneNumber: "018XXXXXXXX",
      },
      {
        type: "mobile_wallet",
        walletName: "Rocket",
        phoneNumber: "019XXXXXXXX",
      },
      { type: "bank", bankName: "Bank C", accountNumber: "1122334455" },
    ],
  },
];

const InfluencerPaymentMethod = ({
  invitationStatus,
}: {
  invitationStatus: "sent" | "accepted";
}) => {
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);
  if (invitationStatus !== "accepted") {
    return null;
  }
  return (
    <CollapsibleCard heading="Influencer’s Payment Methods">
      <div className="grid grid-cols-12 gap-4">
        {/* Left side - Influencer List */}
        <div className="col-span-12 md:col-span-4 border rounded-lg p-4 self-start">
          <div>
            {influencersData.map((influencer) => (
              <div
                className={cn(
                  "border-b py-2",
                  selectedInfluencer?.id === influencer.id &&
                    "bg-linear-to-r from-white to-Secondary rounded-md border  border-light-green"
                )}
                key={influencer.id}
              >
                <div className="flex items-center gap-2 justify-between p-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <Avatar>
                        <AvatarImage
                          src={influencer.avatarUrl}
                          alt={influencer.name}
                        />
                        <AvatarFallback>
                          {influencer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-base font-semibold">
                        {influencer.name}
                      </p>
                      <p className="text-xs text-orange">
                        {influencer.paymentMethods.length} payment methods
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => setSelectedInfluencer(influencer)}
                      variant={"link"}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Payment Methods of selected influencer */}
        <div className="col-span-12 md:col-span-8 border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Payment Methods</h3>
          {!selectedInfluencer ? (
            <p>Select an influencer to see payment methods.</p>
          ) : selectedInfluencer.paymentMethods.length === 0 ? (
            <p>No payment methods available.</p>
          ) : (
            <ul className="space-y-2">
              {selectedInfluencer.paymentMethods.map((method, index) => (
                <li
                  key={index}
                  className="border p-3 rounded-lg bg-linear-to-r from-white to-Secondary border-light-green"
                >
                  {method.type === "bank" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 aspect-square relative">
                        <Image
                          src="/icons/bank-icon.svg"
                          alt="Bank Icon"
                          fill
                        />
                      </div>
                      <div>
                        <p className="text-light-green">Bank Transfer</p>
                        <p className="text-xs font-light text-gray-400">
                          {method.bankName}
                        </p>
                        <p className="text-light-green">
                          <strong>Account Number:</strong>{" "}
                          {method.accountNumber}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-10 aspect-square relative">
                        <Image
                          src="/icons/bkash-icon.svg"
                          alt="Bank Icon"
                          fill
                        />
                      </div>
                      <div>
                        <p className="text-light-green">{method.phoneNumber}</p>
                        <p className="text-xs font-light text-gray-400">
                          {method.walletName}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default InfluencerPaymentMethod;
