import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bookmark,
  Eye,
  Heart,
  MessageCircle,
  MousePointerClick,
  Share2,
  ThumbsUp,
  UserPlus,
  Users,
} from "lucide-react";

export const normalizeKey = (value?: string) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

export const targetIconMap: Record<string, LucideIcon> = {
  view: Eye,
  views: Eye,
  impression: BarChart3,
  impressions: BarChart3,
  reach: Users,
  like: Heart,
  likes: Heart,
  comment: MessageCircle,
  comments: MessageCircle,
  share: Share2,
  shares: Share2,
  click: MousePointerClick,
  clicks: MousePointerClick,
  linkclick: MousePointerClick,
  linkclicks: MousePointerClick,
  save: Bookmark,
  saves: Bookmark,
  vote: ThumbsUp,
  votes: ThumbsUp,
  pollvote: ThumbsUp,
  pollvotes: ThumbsUp,
  follow: UserPlus,
  follows: UserPlus,
};

export const formatDate = (iso?: string) => {
  if (!iso) return "—";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
