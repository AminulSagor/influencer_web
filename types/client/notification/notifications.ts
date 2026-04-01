export type NotificationType =
  | "payment_due"
  | "milestone_declined"
  | "milestone_completed"
  | "nid_approved"
  | "payout_method_approved"
  | "name_change_declined"
  | string;

export type ClientNotification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: NotificationType;
};