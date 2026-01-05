import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const InformationCard = () => {
  type ContactType = "Email" | "Contact" | "website";
  type ContactItem = {
    type: ContactType;
    value: string;
  };
  const contactInfos: ContactItem[] = [
    {
      type: "Email",
      value: "salman_khan@email.com",
    },
    {
      type: "Contact",
      value: "+8801234567890",
    },
    {
      type: "website",
      value: "styleCo.com",
    },
  ];
  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-4">
          {contactInfos.map((info) => (
            <div key={info.type} className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-light-gray" />
              <div className="text-xs">
                <h2 className="text-light-green ">{info.type}</h2>
                <p>{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationCard;
