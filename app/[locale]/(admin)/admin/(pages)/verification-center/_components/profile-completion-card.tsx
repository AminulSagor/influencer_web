import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiSolidEdit } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  title?: string;
  progress: number; // 0 - 100
  bioTitle?: string;
  bioText: string;
  niches: string[];
  skills: string[];
}

const ProfileCompletionCard = ({
  title = "Profile Completion",
  progress,
  bioTitle = "Bio",
  bioText,
  niches,
  skills,
}: Props) => {
  return (
    <div className="">
      <Card>
        <div className="flex">
          <div className="flex-1">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-Primary">
                <FaCheckCircle />
                {title}
              </CardTitle>

              {/* Progress bar */}
              <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-light-green rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="border rounded-lg p-2 space-y-2 h-full">
                <h2 className="text-base font-semibold text-Primary flex items-center gap-2">
                  {bioTitle}
                  <BiSolidEdit size={20} />
                </h2>

                <p className="text-sm font-light text-gray-400">{bioText}</p>
              </div>
            </CardContent>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-Primary">
                  Niches
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-x-2">
                  {(niches ?? []).map((n) => (
                    <Badge variant={"lightGreen"} key={n}>
                      {n}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>
            <div>
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-Primary">
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-x-2">
                  {(skills ?? []).map((n) => (
                    <Badge variant={"lightGreen"} key={n}>
                      {n}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCompletionCard;
