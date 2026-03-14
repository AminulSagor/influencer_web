import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="p-5 rounded-xl bg-linear-to-r from-Primary to-light-green text-white h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 border-4 border-white/30">
            <AvatarImage src={image ?? ""} />
            <AvatarFallback className="text-2xl text-Primary">
              {name?.[0]?.toUpperCase() ?? "B"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm opacity-90">Brand / Client</p>
            <p className="text-sm opacity-90">{location}</p>
            <Badge className="mt-2 bg-white text-Primary hover:bg-white">
              {verifiedStatus}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[180px]">
          {socialLinks.map((item, index) => {
            const Icon = iconMap[item.platform?.toLowerCase()];
            if (!Icon) return null;

            return (
              <div key={`${item.platform}-${index}`} className="flex items-center gap-2 text-sm">
                <Icon className="text-lg" />
                <span className="truncate">{item.url}</span>
              </div>
            );
          })}

          <Button
            variant="secondary"
            className="mt-2 bg-white text-Primary hover:bg-white/90 h-8"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandInfoCard;