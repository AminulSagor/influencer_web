import CollapsibleCard from "../../../../campaigns/campaign-details/_components/collapsible-card";

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  location?: string;
  email?: string;
  phoneNumber?: string;
}

interface Props {
  personalInfo: PersonalInfo;
}

const ProfileDetailsCard = ({ personalInfo }: Props) => {
  return (
    <CollapsibleCard heading="Profile Details">
      <div className="grid grid-cols-2 gap-4 p-3">
        <div className="space-y-4">
          <div>
            <h2 className="text-light-green font-medium">First Name</h2>
            <p className="font-medium">{personalInfo.firstName || "N/A"}</p>
          </div>

          <div>
            <h2 className="text-light-green font-medium">Last Name</h2>
            <p className="font-medium">{personalInfo.lastName || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-light-green">Email Address</p>
            <p className="text-lg">{personalInfo.email || "N/A"}</p>
          </div>

          <div>
            <p className="text-light-green">Phone Number</p>
            <p>{personalInfo.phoneNumber || "N/A"}</p>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default ProfileDetailsCard;