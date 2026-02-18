import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiChevronLeftCircle } from "react-icons/bi";

export type Platform = {
  name: string;
  url: string;
  key: string;
};

export type Influencer = {
  name: string;
  imageUrl: string;
  // ✅ if you have id in future, add it here and use it for keys
  // id?: string;
};

type Status = "Need Quote" | "Pending Invitations" | "Active" | "Completed" | "Paid";

type Props = {
  title: string;
  niche: string;
  status: Status;
  description: string;
  platform: Platform[];
  startDate: string;
  endDate: string;
  clientName: string;
  clientAvatar: string;
  influencers?: Influencer[];
};

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import IconText from "./icon-text";
import { FaClock } from "react-icons/fa";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";
import { AiFillTikTok } from "react-icons/ai";
import { formatDate } from "../../../../_components/format-date";

const CampaignDetailsCard = ({
  title,
  niche,
  status,
  description,
  platform,
  startDate,
  endDate,
  clientName,
  clientAvatar,
  influencers,
}: Props) => {
  const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
    instagram: PiInstagramLogoFill,
    youtube: PiYoutubeLogoFill,
    tiktok: AiFillTikTok,
  };

  return (
    <div className="bg-linear-to-r from-Primary to-light-green p-4 rounded-lg text-off-white ">
      <div className="flex items-center justify-between">
        <Button variant="link" className="has-[>svg]:px-0 text-off-white" asChild>
          <Link href="/admin/campaigns">
            <BiChevronLeftCircle />
            Back to Campaigns
          </Link>
        </Button>

        <Button className="bg-linear-to-r from-white to-Secondary text-light-green">
          {status}
        </Button>
      </div>

      <div>
        <h2 className="text-white-two text-2xl font-semibold">{title}</h2>

        <div className="mt-2 space-x-2">
          <Badge className="bg-white-two text-Primary text-base px-4">{description}</Badge>
          <Badge className="bg-white-two text-Primary text-base px-4">Niche: {niche}</Badge>
        </div>
      </div>

      <div className="mt-4">
        {influencers && influencers.length > 0 && (
          <div>
            <div className="flex items-center gap-1">
              {influencers.map((i, idx) => {
                const key = `${i?.name?.trim() || "influencer"}-${i?.imageUrl || "noimg"}-${idx}`;
                return (
                  <Avatar key={key}>
                    <AvatarImage src={i.imageUrl} alt={i.name} />
                    <AvatarFallback>{(i.name || "?").charAt(0)}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>

            <div className="flex items-center gap-1 mt-2">
              <h3 className="text-white-two font-medium">Influencers:</h3>

              <div className="space-x-2">
                {influencers.map((influencer, idx) => {
                  const key = `${influencer?.name?.trim() || "influencer"}-${
                    influencer?.imageUrl || "noimg"
                  }-${idx}`;

                  return (
                    <Badge className="bg-white-two text-Primary text-xs px-4" key={key}>
                      {influencer.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 mb-4">
        <Separator />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white-two">
          Platforms:
          <div className="flex">
            {platform.map((plat, idx) => {
              const iconKey = String(plat?.key ?? "").trim().toLowerCase();
              const Icon = ICON_MAP[iconKey];
              if (!Icon) return null;

              // ✅ stable unique key (avoid `key={index}` alone)
              const key = `${iconKey || "platform"}-${plat?.url || "nourl"}-${idx}`;

              return (
                <div key={key}>
                  <Icon size={24} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>Client:</div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={clientAvatar} alt={clientName} />
              <AvatarFallback className="text-light-green">
                {(clientName || "?").charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p>{clientName}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mt-2">
        <IconText
          className="text-white-two"
          icon={<FaClock />}
          text={`Start Date: ${formatDate(startDate)}`}
        />
        <IconText
          className="text-white-two"
          icon={<FaClock />}
          text={`End Date: ${formatDate(endDate)}`}
        />
      </div>
    </div>
  );
};

export default CampaignDetailsCard;
