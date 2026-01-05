import { Button } from "@/components/ui/button";
import CollapsibleCard from "./collapsible-card";

interface SocialLinks {
  platform: string;
  handle: string;
  status: "Accepted" | "Rejected" | "Pending";
}

import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";
import { IconType } from "react-icons";

interface Props {
  socialLinks: SocialLinks[];
}

const platformIconMap: Record<string, IconType> = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  Twitter: FiTwitter,
};

const SocialLinksCard = ({ socialLinks }: Props) => {
  return (
    <CollapsibleCard heading="Social Links">
      <div className="space-y-4">
        {socialLinks.map((link) => {
          const Icon = platformIconMap[link.platform];
          return (
            <div key={link.platform} className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                {Icon && <Icon size={20} />}
                <p>{link.handle}</p>
              </div>
              <div className="space-x-2">
                <Button variant={"outline"}>Reject</Button>
                <Button variant={"lightGreen"}>Approve</Button>
              </div>
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
};

export default SocialLinksCard;
