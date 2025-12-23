import { MilestoneStatus } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/types/type";

export type CardTheme = {
  cardBg: string;
  cardBorder: string;
  stepBg: string;
  stepText: string;
  title: string;
  subtitle: string;
  amount: string;
  day: string;
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
  badgeLabel: string;
  hideBadge?: boolean;
};

export const milestoneThemes: Record<MilestoneStatus, CardTheme> = {
  to_do: {
    cardBg: "bg-[#F7FAEC]",
    cardBorder: "border-[#BFD6A7]",
    stepBg: "bg-[#7EA35A]",
    stepText: "text-white",
    title: "text-[#2D5016]",
    subtitle: "text-[#6B7280]",
    amount: "text-[#7EA35A]",
    day: "text-[#7EA35A]",
    badgeBg: "bg-[#EEF6E8]",
    badgeText: "text-[#2D5016]",
    badgeRing: "ring-[#D6E7C9]",
    badgeLabel: "To Do",
  },
  in_review: {
    cardBg: "bg-[#FFF7ED]",
    cardBorder: "border-[#FDBA74]",
    stepBg: "bg-[#EA580C]",
    stepText: "text-white",
    title: "text-[#9A3412]",
    subtitle: "text-[#9A3412]/60",
    amount: "text-[#EA580C]",
    day: "text-[#EA580C]",
    badgeBg: "bg-[#FED7AA]",
    badgeText: "text-[#9A3412]",
    badgeRing: "ring-[#FDBA74]",
    badgeLabel: "In Review",
  },
  partial_paid: {
    cardBg: "bg-[#EFF6FF]",
    cardBorder: "border-[#BFDBFE]",
    stepBg: "bg-[#2563EB]",
    stepText: "text-white",
    title: "text-[#1E40AF]",
    subtitle: "text-[#1E40AF]/60",
    amount: "text-[#2563EB]",
    day: "text-[#2563EB]",
    badgeBg: "bg-[#DBEAFE]",
    badgeText: "text-[#1E40AF]",
    badgeRing: "ring-[#BFDBFE]",
    badgeLabel: "Partial Paid",
  },
  approved: {
    cardBg: "bg-[#F3F4F6]",
    cardBorder: "border-[#E5E7EB]",
    stepBg: "bg-[#9CA3AF]",
    stepText: "text-white",
    title: "text-[#374151]",
    subtitle: "text-[#6B7280]",
    amount: "text-[#374151]",
    day: "text-[#7EA35A]",
    badgeBg: "bg-[#ECFDF5]",
    badgeText: "text-[#065F46]",
    badgeRing: "ring-[#A7F3D0]",
    badgeLabel: "Approved",
    hideBadge: true,
  },
  declined: {
    cardBg: "bg-[#FFE4E6]",
    cardBorder: "border-[#FF0000]",
    stepBg: "bg-[#FF0000]",
    stepText: "text-white",
    title: "text-[#FF0000]",
    subtitle: "text-[#FF0000]/70",
    amount: "text-[#FF0000]",
    day: "text-[#FF0000]",
    badgeBg: "bg-[#FF0000]",
    badgeText: "text-white",
    badgeRing: "ring-[#FF0000]",
    badgeLabel: "Declined",
  },
};
