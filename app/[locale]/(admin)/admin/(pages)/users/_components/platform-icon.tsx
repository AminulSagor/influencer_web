import { AiFillTikTok } from "react-icons/ai";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { PiYoutubeLogoFill } from "react-icons/pi";
import { IconType } from "react-icons";

interface Platform {
  title: string;
  link: string;
  nickName: string;
}

interface Props {
  platform: Platform;
  size?: number;
  className?: string;
}

const platformIcons: Record<string, IconType> = {
  instagram: BiLogoInstagramAlt,
  youtube: PiYoutubeLogoFill,
  tiktok: AiFillTikTok,
};
const PlatformIcon = ({ platform, size = 30, className }: Props) => {
  const Icon = platformIcons[platform.title.toLowerCase()];

  if (!Icon) return null;

  return <Icon size={size} className={className} />;
};

export default PlatformIcon;
