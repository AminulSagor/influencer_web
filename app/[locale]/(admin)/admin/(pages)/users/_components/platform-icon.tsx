import { cn } from "@/lib/utils";
import { AiFillTikTok } from "react-icons/ai";
import { BiLogoFacebook, BiLogoInstagramAlt } from "react-icons/bi";
import { PiYoutubeLogoFill } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { IconType } from "react-icons";

interface Props {
  platform: string;
  size?: number;
  className?: string;
}

const platformIcons: Record<string, IconType> = {
  instagram: BiLogoInstagramAlt,
  youtube: PiYoutubeLogoFill,
  tiktok: AiFillTikTok,
  facebook: BiLogoFacebook,
  twitter: FaXTwitter,
  x: FaXTwitter,
};

const PlatformIcon = ({ platform, size = 18, className }: Props) => {
  const Icon = platformIcons[platform.toLowerCase()];
  if (!Icon) return null;

  return <Icon size={size} className={cn(className)} />;
};

export default PlatformIcon;