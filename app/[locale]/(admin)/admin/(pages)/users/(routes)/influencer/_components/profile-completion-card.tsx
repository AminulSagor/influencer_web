import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  progress: number;
  bioText?: string;
  niches?: string[];
  skills?: string[];
  missingOrPendingSteps?: string[];
}

const ProfileCompletionCard = ({
  progress,
  bioText,
  niches,
  skills,
  missingOrPendingSteps,
}: Props) => {
  const safeNiches = niches ?? [];
  const safeSkills = skills ?? [];
  const safeMissingSteps = missingOrPendingSteps ?? [];
  const safeProgress = Math.max(0, Math.min(progress ?? 0, 100));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-Primary text-base">
          Profile Completion
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${safeProgress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">{safeProgress}% completed</p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <h3 className="text-Primary font-semibold mb-2">Bio</h3>
            <div className="border rounded-lg p-3 min-h-[120px] text-sm text-muted-foreground">
              {bioText || "No bio available"}
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-4">
            <div>
              <h3 className="text-Primary font-semibold mb-2">Niches</h3>
              <div className="flex flex-wrap gap-2">
                {safeNiches.length > 0 ? (
                  safeNiches.map((n, index) => (
                    <Badge variant="lightGreen" key={`${n}-${index}`}>
                      {n}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No niches available</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-Primary font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {safeSkills.length > 0 ? (
                  safeSkills.map((skill, index) => (
                    <Badge variant="lightGreen" key={`${skill}-${index}`}>
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills available</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-Primary font-semibold mb-2">
                Missing / Pending Steps
              </h3>
              <div className="flex flex-wrap gap-2">
                {safeMissingSteps.length > 0 ? (
                  safeMissingSteps.map((step, index) => (
                    <Badge variant="outline" key={`${step}-${index}`}>
                      {step}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No pending steps</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;