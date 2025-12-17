import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, Search } from "lucide-react";
const NewOfferSearch = () => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 flex-1">
        <h3 className="text-sm font-semibold text-Primary whitespace-nowrap">
          New offers just for you
        </h3>

        {/* Search */}
        <div className="relative w-full sm:max-w-sm lg:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search Job, Name, Client Name"
            className="pl-10 focus-visible:border-Primary focus-visible:ring-Primary/50 focus-visible:ring-2"
          />
        </div>

        <p className="text-muted-foreground text-xs whitespace-nowrap">
          Showing 6 of 20 results
        </p>
      </div>

      {/* Sort button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          className=" cursor-pointer bg-Secondary border-light-green border text-Primary text-xs hover:bg-Secondary/70"
        >
          <ArrowDown className="mr-1 h-4 w-4" />
          Low To High
        </Button>
      </div>
    </div>
  );
};

export default NewOfferSearch;
