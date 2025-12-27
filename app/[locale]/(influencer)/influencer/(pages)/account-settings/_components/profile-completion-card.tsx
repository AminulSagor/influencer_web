("");
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ProfileCompletionCard() {
  const t = useTranslations("influencer.account-setting");
  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#2D5016]" />
          <h3 className="text-lg font-semibold text-[#2D5016]">
            {t("Profile Completion")}
          </h3>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#E6ECD9]">
          <div className="h-full w-[60%] rounded-full bg-[#5A7D3B]" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Bio */}
        <Link href={"/influencer/account-settings/verification-checklist"}>
          <div className="rounded-xl border p-4 flex-1 space-y-2">
            <div className="flex gap-2 items-center">
              <p className="font-medium text-[#2D5016]">{t("Bio")}</p>
              <SquarePen className="cursor-pointer text-dark-gray" size={14} />
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              The Authority In Fashion & Lifestyle Marketing. With Deep Industry
              Connections And A Passion For Aesthetics, We Place Your Brand At
              The Center.
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
