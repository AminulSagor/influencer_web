import * as z from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().min(1, "URL or username is required"),
});

export const brandAssetsSchema = z.object({
  website: z.string().min(1, "Website is required"),
  socialLinks: z
    .array(socialLinkSchema)
    .min(1, "At least one social handle is required"),
});

export type BrandAssetsFormValues = z.infer<typeof brandAssetsSchema>;
