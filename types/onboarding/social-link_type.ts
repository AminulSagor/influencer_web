export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "youtube" | "x";

export type SocialLink = {
  platform: SocialPlatform | "";
  profileUrl: string;
};
