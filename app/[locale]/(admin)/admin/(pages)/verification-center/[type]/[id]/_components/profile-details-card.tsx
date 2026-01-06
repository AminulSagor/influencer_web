import React from "react";
import CollapsibleCard from "./collapsible-card";
import IconText from "./icon-text";
import { FaLocationArrow } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  phoneNumber: string;
}

interface Props {
  personalInfo: PersonalInfo;
  type: string;
}

const ProfileDetailsCard = ({ personalInfo, type }: Props) => {
  console.log(personalInfo, "personal info");
  return (
    <CollapsibleCard heading="Profile Details">
      <div className="flex p-4">
        <div className="space-y-6 flex-1">
          <div className="w-[150px] aspect-square rounded-full border border-Primary border-dashed bg-Secondary"></div>
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
          {" "}
          <div className="space-y-4">
            {/* text */}
            <div className="space-y-1">
              <h2 className="text-Primary font-semibold text-lg">
                {personalInfo.firstName + " " + personalInfo.lastName}
              </h2>
              <p className="text-light-green">{type}</p>
            </div>

            {/* Location */}

            <div className="text-light-green flex items-center gap-2">
              <div>
                <MdLocationOn size={35} />
              </div>
              <div>
                <p className="text-lg font-semibold">Bangladesh</p>
                <p>{personalInfo.location}</p>
              </div>
            </div>
            {/* phoen + email */}
            <div className="space-y-2">
              <IconText
                className="text-light-green gap-2"
                icon={<MdEmail size={20} />}
                text={personalInfo.email}
              />
              <IconText
                className="text-light-green gap-2"
                icon={<BsTelephoneFill size={20} />}
                text={personalInfo.phoneNumber}
              />
            </div>
          </div>
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
