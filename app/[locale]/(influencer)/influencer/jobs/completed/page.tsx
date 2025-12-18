import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonLinks from "../_components/button-links";
import CompletedSearch from "./_components/completed-search";
import CompletedJobList from "./_components/completed-job-list";

const page = () => {
  return (
    <div>
      <div className="p-4">
        <Card>
          <CardHeader className="flex justify-between items-center border-b">
            <div>
              <CardTitle className="text-lg font-bold text-Primary">
                Job Marketplace
              </CardTitle>
              <CardDescription>
                Browse and manage your job offers
              </CardDescription>
            </div>
            <div>
              <ButtonLinks />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-8">
            <CompletedSearch />
            <CompletedJobList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
