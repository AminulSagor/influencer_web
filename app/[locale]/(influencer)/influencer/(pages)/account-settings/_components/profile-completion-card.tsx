"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, SquarePen, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { updateInfluencerBasicInfo } from "@/service/influencer/profile/profile";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface ProfileCompletionCardProps {
  profileData: InfluencerProfileData | null;
  loading: boolean;
  refreshProfile: () => void;
}

export default function ProfileCompletionCard({
  profileData,
  loading,
  refreshProfile,
}: ProfileCompletionCardProps) {
  const t = useTranslations("influencer.account-setting");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bioText, setBioText] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync bioText with profileData when it changes
  useEffect(() => {
    if (profileData) {
      setBioText(profileData.bio || "");
    }
  }, [profileData]);

  // Calculate profile completion percentage - recalculates when profileData changes
  const completionPercentage = useMemo(() => {
    if (!profileData) return 0;

    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.bio,
      profileData.profileImg,
      profileData.addresses?.length > 0,
      (profileData.niches?.length ?? 0) > 0,
      (profileData.skills?.length ?? 0) > 0,
      profileData.socialLinks?.length > 0,
      profileData.nidNumber,
      profileData.payouts?.bank?.length ||
        profileData.payouts?.mobileBanking?.length,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [profileData]);

  const handleOpenDialog = () => {
    setBioText(profileData?.bio || "");
    setIsDialogOpen(true);
  };

  const handleSaveBio = async () => {
    if (!profileData) return;

    // Validate required fields
    if (!profileData.firstName?.trim() || !profileData.lastName?.trim()) {
      toast.error("Profile data is incomplete. Please update your name first.");
      setIsDialogOpen(false);
      return;
    }

    const newBio = bioText.trim() || null;

    // Close dialog immediately
    setIsDialogOpen(false);

    try {
      setSaving(true);

      const updateData: any = {
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
        bio: newBio,
      };

      // Only include profileImg if it's a valid URL string
      if (profileData.profileImg) {
        updateData.profileImg = profileData.profileImg;
      }

      // Include website if it exists
      if (profileData.website) {
        updateData.website = profileData.website;
      }

      const response = await updateInfluencerBasicInfo(updateData);

      if (response.success) {
        toast.success("Bio updated successfully");
        // Refresh parent data
        refreshProfile();
      } else {
        toast.error(response.message || "Failed to update bio");
      }
    } catch (error: any) {
      console.error("Failed to update bio:", error);
      console.error("Error response:", error?.response?.data);
      toast.error(error?.response?.data?.message || "Failed to update bio");
    } finally {
      setSaving(false);
    }
  };

  const bio = profileData?.bio || "No bio added yet. Tell us about yourself!";

  return (
    <>
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
            <div
              className="h-full rounded-full bg-[#5A7D3B] transition-all duration-500"
              style={{ width: `${loading ? 0 : completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${completionPercentage}% complete`}
          </p>
        </CardHeader>

        <CardContent>
          {/* Bio */}
          <div
            onClick={handleOpenDialog}
            className="rounded-xl border p-4 flex-1 space-y-2 hover:border-light-green/50 transition-colors cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <p className="font-medium text-[#2D5016]">{t("Bio")}</p>
              <SquarePen className="cursor-pointer text-dark-gray" size={14} />
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              {loading ? "Loading bio..." : bio}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bio Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>Edit Bio</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Tell us about yourself..."
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                rows={8}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bioText.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveBio}
              disabled={saving}
              className="bg-light-green hover:bg-light-green/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Bio"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
