import CollapsibleCard from "./collapsible-card";
import { VerificationStatus } from "../../../_components/verification-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Niche {
  name: string;
  status: VerificationStatus;
}

interface Props {
  niches: Niche[];
}

const NicheCard = ({ niches }: Props) => {
  return (
    <CollapsibleCard heading="Niches">
      <div className="space-y-4">
        {niches.map((niche) => {
          return (
            <div key={niche.name} className="flex items-center gap-10">
              <div>
                <Badge variant={"lightGreen"} className="border-0 px-6 py-2">
                  {niche.name}
                </Badge>
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

export default NicheCard;
