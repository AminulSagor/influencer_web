import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const step6Schema = z.object({
  website: z.string().url().optional().or(z.literal("")),
  socialLinks: z.array(
    z.object({
      platform: z.string().min(1, "Please select a platform"),
      url: z.string().url("Please enter a valid URL"),
    })
  ),
});