import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  progress: number;
  niches?: string[];
}

const BrandProfileCompletionCard = ({ progress, niches = [] }: Props) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-Primary text-base">
          Profile Completion
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-light-green rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div>
          <h3 className="text-Primary font-semibold mb-2">Niches</h3>
          <div className="flex flex-wrap gap-2">
            {niches.length > 0 ? (
              niches.map((niche, index) => (
                <Badge variant="lightGreen" key={`${niche}-${index}`}>
                  {niche}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No niches available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandProfileCompletionCard;