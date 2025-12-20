import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { AiFillTikTok } from "react-icons/ai";
import { BiLeftArrow, BiSolidLeftArrow } from "react-icons/bi";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
const CampaignDetailsCard = () => {
  return (
    <Card className="gap-2 h-full">
      <CardHeader>
        <div>
          <Button
            variant="link"
            asChild
            className="has-[>svg]:px-0 text-dark-gray font-medium"
          >
            <Link href="/agency/jobs">
              <BiSolidLeftArrow />
              Back to Campaigns
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <CardTitle className="text-Primary font-semibold text-lg">
              Summer Fashion Campaign
            </CardTitle>
          </div>
          <div>
            <Badge className="bg-light-green">New</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={"https://github.com/ninjastorm24.png"} />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
          <p className="text-orange text-sm font-medium">StyleCO.</p>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-muted-foreground text-sm font-medium">Platforms</p>
          <div className="flex gap-2">
            <span>
              <RiInstagramFill size={30} className="fill-light-green" />
            </span>
            <span>
              <RiYoutubeFill size={30} className="fill-light-green" />
            </span>
            <span>
              <AiFillTikTok size={30} className="fill-light-green" />
            </span>
          </div>
        </div>
        <div>
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <Checkbox
              className="data-[state=checked]:bg-light-green data-[state=checked]:border-light-green"
              id="terms"
            />
            <p className="text-sm text-dark-gray select-none">
              You accept the&nbsp;
              <span className="text-light-green font-medium">
                <Link
                  href="/agency/user-license-agreement"
                  className="hover:underline"
                >
                  user license agreement
                </Link>
                &nbsp;
              </span>
              &&nbsp;
              <span className="text-light-green font-medium">
                <Link
                  href="/agency/terms-and-conditions"
                  className="hover:underline"
                >
                  Terms and condition
                </Link>
              </span>
              &nbsp;of our app.
            </p>
          </label>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button className="flex-1 rounded-full bg-light-green hover:bg-light-green/90">
            Accept Quote
          </Button>
          <Button className="flex-1 rounded-full" variant={"outline"}>
            Request To Requote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignDetailsCard;
