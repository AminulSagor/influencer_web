// action-item.config.ts
import { FaFile, FaExclamationTriangle, FaMoneyBillWave } from "react-icons/fa";
import Image from "next/image";
import React from "react";

export type ActionType = "campaign" | "verification" | "payout" | "milestone";

export const ACTION_ITEM_CONFIG: Record<
  ActionType,
  {
    bg: string;
    text: string;
    iconColor: string;
    buttonBg: string;
    buttonHover: string;
    buttonText: string;
    icon: React.ReactNode;
  }
> = {
  campaign: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    iconColor: "text-purple-600",
    buttonBg: "bg-purple-600",
    buttonHover: "hover:bg-purple-500",
    buttonText: "Create Quote",
    icon: <FaFile size={40} />,
  },

  verification: {
    bg: "bg-orange/20",
    text: "text-yellow-600",
    iconColor: "text-yellow-600",
    buttonBg: "bg-yellow-600",
    buttonHover: "hover:bg-yellow-500",
    buttonText: "Review",
    icon: <FaExclamationTriangle size={40} />,
  },

  payout: {
    bg: "bg-lime-50",
    text: "text-lime-600",
    iconColor: "text-lime-600",
    buttonBg: "bg-lime-600",
    buttonHover: "hover:bg-lime-500",
    buttonText: "Process Payment",
    icon: <FaMoneyBillWave size={40} />,
  },

  milestone: {
    bg: "bg-blue-50",
    text: "text-Blue",
    iconColor: "text-Blue",
    buttonBg: "bg-Blue",
    buttonHover: "hover:bg-Blue/90",
    buttonText: "Process Payment",
    icon: (
      <div className="relative h-10 aspect-square">
        <Image src="/icons/milestone-blue.svg" alt="" fill />
      </div>
    ),
  },
};
