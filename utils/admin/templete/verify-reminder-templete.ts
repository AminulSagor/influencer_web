import type { VerifyReminderTargetRole } from "@/service/admin/verification-center/send-verify-reminder";

export type VerifyReminderKey =
  | "nid"
  | "niche"
  | "social-link"
  | "skill"
  | "payout"
  | "trade-license"
  | "tin"
  | "bin"
  | "email"
  | "profile";

const DEFAULT_LABELS: Record<VerifyReminderKey, string> = {
  nid: "NID",
  niche: "Niche",
  "social-link": "Social Link",
  skill: "Skill",
  payout: "Payout Method",
  "trade-license": "Trade License",
  tin: "TIN",
  bin: "BIN",
  email: "Email",
  profile: "Profile",
};

export const getVerifyReminderTemplate = ({
  reminderKey,
  targetRole,
  customLabel,
}: {
  reminderKey: VerifyReminderKey;
  targetRole: VerifyReminderTargetRole;
  customLabel?: string;
}) => {
  const sectionLabel = customLabel?.trim() || DEFAULT_LABELS[reminderKey];

  return {
    title: `Verify Your ${sectionLabel}`,
    message: `Hi there! Please complete your ${sectionLabel} verification to complete your ${targetRole} profile.`,
  };
};