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
    <div className="rounded-xl bg-linear-to-r from-Primary to-light-green p-4 text-white sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <Avatar className="h-20 w-20 border-4 border-white/30 sm:h-24 sm:w-24">
            <AvatarImage src={image ?? ""} />
            <AvatarFallback className="text-xl text-Primary sm:text-2xl">
              {name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="flex flex-wrap items-center justify-center gap-2 text-lg font-semibold sm:justify-start sm:text-xl">
              <span className="break-words">{name}</span>
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
            </h2>

            <p className="text-sm opacity-90">{formatRole(role)}</p>
            <p className="break-words text-sm opacity-90">{location}</p>

            <Badge className="mt-2 bg-white text-Primary hover:bg-white">
              {verifiedStatus}
            </Badge>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[180px]">
          {socialHandles &&
            Object.entries(socialHandles).map(([key, value]) => {
              if (!value) return null;

              const config = SOCIAL_CONFIG[key as keyof typeof SOCIAL_CONFIG];
              if (!config) return null;

              const Icon = config.icon;

              return (
                <p
                  key={key}
                  className="flex items-center justify-center gap-2 text-sm sm:justify-start"
                >
                  <Icon className="shrink-0 text-lg" />
                  <span className="truncate">{value}</span>
                </p>
              );
            })}

          <Button
            variant="secondary"
            className="mt-2 h-9 w-full bg-white text-Primary hover:bg-white/90 lg:w-auto"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;