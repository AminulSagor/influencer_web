export function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildDueLabelFromDeadline(deadline?: string | null) {
  if (!deadline) return "Due: —";

  const now = new Date();
  const target = new Date(deadline);

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffDays = Math.ceil(
    (startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due: Today";
  if (diffDays === 1) return "Due: Tomorrow";
  return `Due: ${diffDays} Days`;
}

//calculate due days
export const getDueDays = (deadline: string) => {
  const today = new Date();
  const endDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Due Today";
  if (diffDays === 1) return "Due: 1 Day";
  return `Due: ${diffDays} Days`;
};
