import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DefaultValueCard from "./_components/default-value-card";
import NicheListCard from "./_components/niche-list-card";
import SkillsList from "./_components/skills-list";
import ProductTypes from "./_components/productt-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityCard from "./_components/security-card";
import LoginActivityCard from "./_components/login-activity-card";

const page = () => {
  return (
    <div className="p-4">
      <h2 className="text-Primary text-xl font-semibold mb-4">
        General Settings
      </h2>
      <div className="space-y-4">
        <div>
          <DefaultValueCard />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <NicheListCard />
          </div>
          <div className="col-span-12 md:col-span-4">
            <SkillsList />
          </div>
          <div className="col-span-12 md:col-span-4">
            <ProductTypes />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-xl text-Primary mb-4">Security</h2>
          <Tabs defaultValue="security">
            <TabsList className="w-full bg-white">
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-light-green data-[state=active]:text-white"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-light-green data-[state=active]:text-white"
                value="login_activity"
              >
                Login Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="security" className="space-y-4">
              <SecurityCard />
            </TabsContent>
            <TabsContent value="login_activity" className="space-y-4">
              <LoginActivityCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
