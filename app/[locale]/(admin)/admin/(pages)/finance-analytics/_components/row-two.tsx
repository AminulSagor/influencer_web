import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTab from "./pending-tab";

const RowTwo = () => {
  return (
    <div className="col-span-12">
      <Tabs defaultValue="pending">
        <TabsList className="w-full bg-white">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-light-green data-[state=active]:text-white"
          >
            Pending Clearance
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-light-green data-[state=active]:text-white"
            value="completed"
          >
            Completed
          </TabsTrigger>
        </TabsList>
        <PendingTab />
        <TabsContent value="completed" className="space-y-4">
          hello completed
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RowTwo;
