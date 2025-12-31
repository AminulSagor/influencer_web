import { Eye, Play, Heart, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const compact = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
  return String(n);
};

export const statusStyle = (status?: string) => {
  const s = String(status ?? "").toLowerCase();
  if (s === "completed")
    return {
      badge: "bg-light-green/20 text-light-green border-light-green/30",
    };
  if (s === "inreview" || s === "in review")
    return { badge: "bg-orange-100 text-orange-600 border-orange-200" };
  if (s === "declined" || s === "rejected")
    return { badge: "bg-red-100 text-red-600 border-red-200" };
  return { badge: "bg-white text-black/60 border-black/10" };
};

export const targetIconMap: Record<string, LucideIcon> = {
  reach: Eye,
  views: Play,
  reaction: Heart,
  comment: MessageCircle,
};

export const normalizeKey = (k?: string) =>
  (k ?? "").trim().toLowerCase().replaceAll(" ", "_");
