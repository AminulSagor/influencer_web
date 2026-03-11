import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiSolidEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

type ProfileCompletionCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
};

const getCompletionPercentage = (profile: AgencyProfileResponse | null) => {
  if (!profile) return 0;

  const checks = [
    !!profile.agencyName,
    !!profile.firstName,
    !!profile.lastName,
    !!profile.logo,
    !!profile.agencyBio,
    !!profile.serviceFee,
    !!profile.dollarRate,
    !!profile.address?.thana,
    !!profile.address?.zilla,
    !!profile.address?.fullAddress,
    profile.niches.length > 0,
    profile.socialLinks.length > 0,
    !!profile.nidNumber,
    !!profile.tradeLicenseNumber,
    !!profile.tinNumber,
    !!profile.binNumber,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const ProfileCompletionCard = ({
  profile,
  isLoading,
}: ProfileCompletionCardProps) => {
  const completion = getCompletionPercentage(profile);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-Primary">
          <FaCheckCircle /> Profile Completion
        </CardTitle>

        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/30">
            <div
              className="h-full rounded-full bg-light-green transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 rounded-lg border p-2">
          <h2 className="flex items-center gap-2 text-base font-semibold text-Primary">
            Bio <BiSolidEdit size={20} />
          </h2>
          <p className="text-sm font-light text-gray-400">
            {isLoading ? "Loading..." : profile?.agencyBio || "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;