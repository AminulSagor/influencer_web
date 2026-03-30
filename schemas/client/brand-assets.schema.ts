import * as z from "zod";

export const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().min(1, "URL is required").url("Invalid URL format"),
});

export const brandAssetsSchema = z.object({
  website: z.string().min(1, "Website is required").url("Invalid website URL"),
  socialLinks: z
    .array(socialLinkSchema)
    .min(1, "At least one social handle is required"),
});

export type BrandAssetsFormValues = z.infer<typeof brandAssetsSchema>;
