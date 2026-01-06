import React from "react";
import { VerificationStatus } from "../../../_components/verification-data";
import CollapsibleCard from "./collapsible-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Skill {
  name: string;
  status: VerificationStatus;
}

interface Props {
  skills: Skill[];
}

const SkillsCard = ({ skills }: Props) => {
  return (
    <CollapsibleCard heading="Skills">
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {skills.map((skill) => {
            return (
              <div key={skill.name}>
                <Badge variant={"lightGreen"}>{skill.name}</Badge>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-10">
          <Button variant={"outline"}>Reject</Button>
          <Button variant={"lightGreen"}>Approve</Button>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default SkillsCard;
