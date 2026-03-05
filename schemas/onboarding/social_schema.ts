// // import { z } from "zod";

// // export const PLATFORM_OPTIONS = ["Facebook", "YouTube", "TikTok", "LinkedIn"] as const;

// // export const socialLinkSchema = z
// //   .object({
// //     platform: z.string().trim().optional().default(""),
// //     url: z.string().trim().optional().default(""),
// //   })
// //   .superRefine((val, ctx) => {
// //     const p = (val.platform ?? "").trim();
// //     const u = (val.url ?? "").trim();

// //     // empty row allowed
// //     if (!p && !u) return;

// //     if (p && !PLATFORM_OPTIONS.includes(p as any)) {
// //       ctx.addIssue({
// //         code: z.ZodIssueCode.custom,
// //         message: "Please select a valid platform.",
// //         path: ["platform"],
// //       });
// //     }

// //     if ((p && !u) || (!p && u)) {
// //       ctx.addIssue({
// //         code: z.ZodIssueCode.custom,
// //         message: "Platform and URL must be provided together.",
// //         path: !p ? ["platform"] : ["url"],
// //       });
// //     }

// //     // basic url check when provided
// //     if (u) {
// //       try {
// //         const url = new URL(u);
// //         if (url.protocol !== "http:" && url.protocol !== "https:") {
// //           ctx.addIssue({
// //             code: z.ZodIssueCode.custom,
// //             message: "URL must start with http:// or https://",
// //             path: ["url"],
// //           });
// //         }
// //       } catch {
// //         ctx.addIssue({
// //           code: z.ZodIssueCode.custom,
// //           message: "Invalid URL",
// //           path: ["url"],
// //         });
// //       }
// //     }
// //   });

// // export const socialStepSchema = z.object({
// //   website: z
// //     .string()
// //     .trim()
// //     .optional()
// //     .default("")
// //     .superRefine((v, ctx) => {
// //       const value = (v ?? "").trim();
// //       if (!value) return;

// //       try {
// //         const url = new URL(value);
// //         if (url.protocol !== "http:" && url.protocol !== "https:") {
// //           ctx.addIssue({
// //             code: z.ZodIssueCode.custom,
// //             message: "Website must start with http:// or https://",
// //           });
// //         }
// //       } catch {
// //         ctx.addIssue({
// //           code: z.ZodIssueCode.custom,
// //           message: "Invalid website URL",
// //         });
// //       }
// //     }),
// //   socialLinks: z.array(socialLinkSchema).default([{ platform: "", url: "" }]),
// // });

// // export type SocialStepValues = z.infer<typeof socialStepSchema>;


// import { z } from "zod";

// export const SOCIAL_PLATFORMS = ["facebook", "instagram", "tiktok", "youtube", "x"] as const;
// export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

// export const socialLinkSchema = z
//   .object({
//     platform: z.enum(SOCIAL_PLATFORMS).or(z.literal("")),
//     url: z.string().trim(),
//   })
//   .superRefine((row, ctx) => {
//     const p = (row.platform ?? "").toString().trim();
//     const u = (row.url ?? "").trim();

//     // allow empty row
//     if (!p && !u) return;

//     // if platform selected, url required
//     if (p && !u) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["url"],
//         message: "After selecting platform, enter URL.",
//       });
//       return;
//     }

//     // if url typed, platform required
//     if (!p && u) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["platform"],
//         message: "Please select a platform.",
//       });
//       return;
//     }

//     // validate url if present
//     try {
//       const url = new URL(u);
//       if (url.protocol !== "http:" && url.protocol !== "https:") {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           path: ["url"],
//           message: "Invalid URL (use http/https).",
//         });
//       }
//     } catch {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["url"],
//         message: "Invalid URL (use http/https).",
//       });
//     }
//   });

// export const socialSchema = z.object({
//   website: z
//     .string()
//     .trim()
//     .optional()
//     .transform((v) => v ?? "")
//     .refine((v) => {
//       if (!v) return true;
//       try {
//         const url = new URL(v);
//         return url.protocol === "http:" || url.protocol === "https:";
//       } catch {
//         return false;
//       }
//     }, "Invalid website URL (use http/https)"),
//   socialLinks: z.array(socialLinkSchema).default([{ platform: "", url: "" }]),
// });

// export type SocialFormValues = z.infer<typeof socialSchema>;

import { z } from "zod";

export const SOCIAL_PLATFORMS = ["facebook", "instagram", "tiktok", "youtube", "x"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const socialLinkRowSchema = z
  .object({
    platform: z.union([z.enum(SOCIAL_PLATFORMS), z.literal("")]),
    url: z.string().trim().default(""),
  })
  .superRefine((row, ctx) => {
    const p = (row.platform ?? "").trim();
    const u = (row.url ?? "").trim();

    if (!p && !u) return; // empty row ok

    if (p && !u) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: "After selecting platform, enter URL.",
      });
      return;
    }

    if (!p && u) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["platform"],
        message: "Please select a platform.",
      });
      return;
    }

    try {
      const url = new URL(u);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["url"],
          message: "Invalid URL (use http/https).",
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["url"],
        message: "Invalid URL (use http/https).",
      });
    }
  });

// ✅ website is OPTIONAL in meaning, but ALWAYS a string in the form ("")
export const socialSchema = z.object({
  website: z
    .string()
    .trim()
    .default("") // never undefined → fixes resolver mismatch
    .refine((v) => {
      if (!v) return true; // empty allowed
      try {
        const url = new URL(v);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Invalid website URL (use http/https)."),

  socialLinks: z.array(socialLinkRowSchema).default([{ platform: "", url: "" }]),
});

export type SocialFormValues = z.infer<typeof socialSchema>;
