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

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diffDays = Math.ceil(
    (startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due: Today";
  if (diffDays === 1) return "Due: Tomorrow";
  return `Due: ${diffDays} Days`;
}
