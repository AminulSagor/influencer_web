import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";

interface Props {
  name: string;
  location: string;
  image?: string | null;
  role?: string;
  socialHandles?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
  verifiedStatus: string;
}

const SOCIAL_CONFIG = {
  instagram: {
    icon: FaInstagram,
  },
  tiktok: {
    icon: FaTiktok,
  },
  twitter: {
    icon: FaTwitter,
  },
};

const formatRole = (role?: string) => {
  if (!role) return "User";

  return role
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(" ");
};

const InfoCard = ({
  location,
  name,
  socialHandles,
  verifiedStatus,
  image,
  role,
}: Props) => {
  return (
    <div className="p-5 rounded-xl bg-linear-to-r from-Primary to-light-green text-white h-full flex flex-col justify-between">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 border-4 border-white/30">
            <AvatarImage src={image ?? ""} />
            <AvatarFallback className="text-2xl text-Primary">
              {name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {name}
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
            </h2>
            <p className="text-sm opacity-90">{formatRole(role)}</p>
            <p className="text-sm opacity-90">{location}</p>
            <Badge className="mt-2 bg-white text-Primary hover:bg-white">
              {verifiedStatus}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[180px]">
          {socialHandles &&
            Object.entries(socialHandles).map(([key, value]) => {
              if (!value) return null;

              const config = SOCIAL_CONFIG[key as keyof typeof SOCIAL_CONFIG];
              if (!config) return null;

              const Icon = config.icon;

              return (
                <p key={key} className="flex items-center gap-2 text-sm">
                  <Icon className="text-lg" />
                  <span className="truncate">{value}</span>
                </p>
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

export default InfoCard;