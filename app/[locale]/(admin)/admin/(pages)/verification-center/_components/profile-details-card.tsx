import React from "react";

import { FaLocationArrow } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";
import IconText from "../../../../campaigns/campaign-details/_components/icon-text";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  phoneNumber: string;
}

interface Props {
  personalInfo: PersonalInfo;
  type?: string;
}

const ProfileDetailsCard = ({ personalInfo, type }: Props) => {
  return (
    <CollapsibleCard heading="Profile Details">
      <div className="flex p-4">
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <div>
              <h2 className="text-light-green font-medium">First Name</h2>
              <p className="font-medium">{personalInfo.firstName}</p>
            </div>
            <div>
              <h2 className="text-light-green font-medium">Last Name</h2>
              <p className="font-medium">{personalInfo.lastName}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 flex-1 ">
          <div className="space-y-2">
            <div>
              <p className="text-light-green">Email Address</p>
              <p className="text-lg">{personalInfo.email}</p>
            </div>

            <div>
              <p className="text-light-green">Phone Number</p>
              <p>{personalInfo.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProfileDetailsCard;
