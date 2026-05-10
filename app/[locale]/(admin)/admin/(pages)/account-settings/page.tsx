import DefaultValueCard from "./_components/default-value-card";
import NicheListCard from "./_components/niche-list-card";
import SkillsList from "./_components/skills-list";
import ProductTypes from "./_components/product-types";
import PlatformsList from "./_components/platforms-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityCard from "./_components/security-card";
import LoginActivityCard from "./_components/login-activity-card";
import { getPlatformFee } from "@/service/admin/settings/get-platform-fee";
import { getNiches } from "@/service/admin/settings/get-niches";
import { getSkills } from "@/service/admin/settings/get-skills";
import { getProductTypes } from "@/service/admin/settings/get-productType";
import { getPlatforms } from "@/service/admin/settings/get-platforms";
import { getActivityLog } from "@/service/admin/settings/get-activity-log";

const page = async () => {
  const generalSettings = await getPlatformFee();
  const niches = await getNiches();
  const skills = await getSkills();
  const productTypes = await getProductTypes();
  const platforms = await getPlatforms();
  const activityLog = await getActivityLog();

  return (
    <div className="p-4">
      <h2 className="text-Primary text-xl font-semibold mb-4">
        General Settings
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <DefaultValueCard
              initialPlatformFee={String(generalSettings?.platformFee ?? "")}
              initialVatTax={String(generalSettings?.vatTax ?? "")}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <PlatformsList initialPlatforms={platforms} />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <NicheListCard initialNiches={niches} />
          </div>

          <div className="col-span-12 md:col-span-4">
            <SkillsList initialSkills={skills} />
          </div>

          <div className="col-span-12 md:col-span-4">
            <ProductTypes initialProductTypes={productTypes} />
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
              <LoginActivityCard
                history={activityLog.data}
                meta={activityLog.meta}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
