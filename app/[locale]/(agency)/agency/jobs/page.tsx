import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonLinks from "./_components/button-links";
import NewOfferSearch from "./_components/new-offer-search";
import NewOfferList from "./_components/new-offer-list";

const page = () => {
  return (
    <div className="p-4">
      <Card>
        {/* Header */}
        <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-Primary">
              Job Marketplace
            </CardTitle>
            <CardDescription>Browse and manage your job offers</CardDescription>
          </div>

          {/* Button links */}
          <div className="w-full sm:w-auto">
            <ButtonLinks />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-4 space-y-8">
          <NewOfferSearch />
          <NewOfferList />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
