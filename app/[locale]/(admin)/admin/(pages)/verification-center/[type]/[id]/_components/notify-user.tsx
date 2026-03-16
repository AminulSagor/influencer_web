"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { sendVerifyReminder } from "@/service/admin/verification-center/send-verify-reminder";
import type { VerifyReminderTargetRole } from "@/service/admin/verification-center/send-verify-reminder";
import {
  getVerifyReminderTemplate,
  type VerifyReminderKey,
} from "@/utils/admin/templete/verify-reminder-templete";

interface Props {
  userId: string;
  targetRole: VerifyReminderTargetRole;
  reminderKey: VerifyReminderKey;
  customLabel?: string;
  className?: string;
  onSent?: () => void;
}

const NotifyUser = ({
  userId,
  targetRole,
  reminderKey,
  customLabel,
  className,
  onSent,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    try {
      setLoading(true);

      const { title, message } = getVerifyReminderTemplate({
        reminderKey,
        targetRole,
        customLabel,
      });

      const res = await sendVerifyReminder({
        userId,
        targetRole,
        title,
        message,
      });

      toast.success(res.message || `${title} reminder sent successfully.`);
      onSent?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send reminder.";

      toast.error(message);
      console.error("verify reminder failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleNotify();
      }}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-2xl bg-[#d88422] px-5 text-white transition hover:bg-[#c97818] disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
    >
      <Bell className="h-4 w-4 fill-white text-white" />
      <span className="text-[15px] font-medium">
        {loading ? "Sending..." : "Notify"}
      </span>
    </button>
  );
};

export default NotifyUser;