import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";

interface Props {
  name: string;
  location: string;
  image?: string | null;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  verifiedStatus: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  twitter: FaTwitter,
  x: FaTwitter,
  youtube: FaYoutube,
  facebook: FaFacebook,
};

const BrandInfoCard = ({
  name,
  location,
  image,
  socialLinks = [],
  verifiedStatus,
}: Props) => {
  return (
    <div className="flex h-full min-h-[220px] items-center rounded-xl bg-linear-to-r from-Primary to-light-green p-4 text-white sm:p-5">
      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <Avatar className="h-20 w-20 border-4 border-white/30 sm:h-24 sm:w-24">
            <AvatarImage src={image ?? ""} />
            <AvatarFallback className="text-xl text-Primary sm:text-2xl">
              {name?.[0]?.toUpperCase() ?? "B"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="break-words text-lg font-semibold sm:text-xl">
              {name}
            </h2>
            <p className="text-sm opacity-90">Brand</p>
            <p className="break-words text-sm opacity-90">{location}</p>
            <Badge className="mt-2 bg-white text-Primary hover:bg-white">
              {verifiedStatus}
            </Badge>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[180px]">
          {socialLinks.map((item, index) => {
            const Icon = iconMap[item.platform?.toLowerCase()];
            if (!Icon) return null;

            return (
              <div
                key={`${item.platform}-${index}`}
                className="flex items-center justify-center gap-2 text-sm sm:justify-start"
              >
                <Icon className="shrink-0 text-lg" />
                <span className="truncate">{item.url}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandInfoCard;