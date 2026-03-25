export type CardStatus = "Pending" | "Rejected" | "Accepted";

export type ApprovalStep = {
  label: string;
  status: "completed" | "pending";
  subtitle: string;
};

export const mapStatus = (value?: string | null, isVerified?: boolean): CardStatus => {
  const normalized = (value ?? "").trim().toLowerCase();

  if (
    normalized === "accepted" ||
    normalized === "approved" ||
    normalized === "verified"
  ) {
    return "Accepted";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  if (normalized === "pending" || normalized === "unverified") {
    return "Pending";
  }

  return isVerified ? "Accepted" : "Pending";
};

export const getTypeKey = (type: string) =>
  type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

export const isApprovedStatus = (value?: string | null) => {
  const normalized = (value ?? "").trim().toLowerCase();

  return (
    normalized === "approved" ||
    normalized === "accepted" ||
    normalized === "verified"
  );
};

export const getSimpleStep = (
  label: string,
  completed: boolean,
  completedText = "Approved"
): ApprovalStep => ({
  label,
  status: completed ? "completed" : "pending",
  subtitle: completed ? completedText : "Pending",
});

export const getCountStep = (label: string, count: number): ApprovalStep => ({
  label,
  status: count > 0 ? "completed" : "pending",
  subtitle: count > 0 ? `${count} Approved` : "Pending",
});

export const getPaymentStep = (items: { status?: string | null }[]): ApprovalStep => {
  const approved = items.filter((item) => isApprovedStatus(item.status)).length;
  const pending = items.length - approved;

  if (items.length === 0) {
    return {
      label: "Payment Setup",
      status: "pending",
      subtitle: "Pending",
    };
  }

  if (pending === 0) {
    return {
      label: "Payment Setup",
      status: "completed",
      subtitle: `${approved} Approved`,
    };
  }

  return {
    label: "Payment Setup",
    status: approved > 0 ? "completed" : "pending",
    subtitle:
      approved > 0
        ? `${approved} Approved, ${pending} Pending`
        : `${pending} Pending`,
  };
};