import { Badge } from "@/components/ui/badge";
import React from "react";
type Props = {
  title: string;
  influencers: Influencer[];
};
type Influencer = {
  name: string;
  platform: string;
  profileUrl: string;
};

const InfluencerBadges = ({ title, influencers }: Props) => {
  return (
    <div>
      <h2 className="text-Primary mb-2 font-semibold">{title}</h2>

      <div className="border rounded-md p-4 flex flex-wrap gap-1">
        {influencers.map((influencer, index) => (
          <Badge key={index} variant="lightGreen">
            {influencer.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default InfluencerBadges;
