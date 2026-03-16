import { Badge } from "@/components/ui/badge";
import React from "react";
import { VerificationStatus } from "../../../_components/verification-data";
import { FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Image from "next/image";

interface Props {
  name: string;
  location: string;
  image?: string | null;
  socialHandles?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
  verifiedStatus: VerificationStatus;
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

const InfoCard = ({
  location,
  name,
  socialHandles,
  verifiedStatus,
  image,
}: Props) => {
  return (
    <div className="p-4 rounded-lg bg-linear-to-r from-Primary to-light-green text-white h-full flex flex-col">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-[80px] aspect-square rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : null}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm">{location}</p>
            <Badge className="mt-1">{verifiedStatus}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {socialHandles &&
            Object.entries(socialHandles).map(([key, value]) => {
              if (!value) return null;

              const config = SOCIAL_CONFIG[key as keyof typeof SOCIAL_CONFIG];
              if (!config) return null;

              const Icon = config.icon;

              return (
                <p
                  key={key}
                  className="flex items-center gap-2 px-3 py-2 rounded-md"
                >
                  <Icon className="text-lg" />
                  <span className="text-sm break-all">{value}</span>
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;