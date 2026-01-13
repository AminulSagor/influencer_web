import { FiInstagram } from "react-icons/fi";
import {
  FaYoutube,
  FaTiktok,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa6";

export function getPlatformIcon(platform: string, className = "h-5 w-5 text-white") {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <FiInstagram className={className} />;
    case "youtube":
      return <FaYoutube className={className} />;
    case "tiktok":
      return <FaTiktok className={className} />;
    case "facebook":
      return <FaFacebookF className={className} />;
    case "twitter":
      return <FaTwitter className={className} />;
    case "linkedin":
      return <FaLinkedin className={className} />;
    default:
      return <FiInstagram className={className} />;
  }
}
