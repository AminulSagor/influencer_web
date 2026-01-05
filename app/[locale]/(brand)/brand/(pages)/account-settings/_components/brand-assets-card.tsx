"use client";

import React from "react";
import { X, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin";

type SocialHandleRow = {
  id: string;
  platform: SocialPlatform;
  url: string;
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

const BrandAssetsCard = () => {
  const [rows, setRows] = React.useState<SocialHandleRow[]>([
    { id: "1", platform: "facebook", url: "fb.com/growbig" },
    { id: "2", platform: "instagram", url: "" },
  ]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), platform: "instagram", url: "" },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, patch: Partial<SocialHandleRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  return (
    <Card className="py-0 relative">
      <CardContent className="px-5 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-28">
                <h1 className="font-semibold text-base text-Primary">
                  Brand Assets
                </h1>
              </div>
            </AccordionTrigger>

            {/* Edit button (like your SS: pill, top-right) */}
            <button className="rounded-full text-xs px-8 border bg-light-green text-white absolute top-4.5 right-16 py-1 cursor-pointer">
              Edit
            </button>

            <AccordionContent className="pt-4 pb-1">
              <div className="space-y-3">
                <h2 className="text-Primary text-sm font-medium">
                  Social Handles
                </h2>

                {/* Rows */}
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[150px_1fr] items-end"
                    >
                      {/* Platform Select */}
                      <div className="space-y-1">
                        <p className="text-xs text-Primary/70">Choose Handle</p>
                        <Select
                          value={row.platform}
                          onValueChange={(v) =>
                            updateRow(row.id, { platform: v as SocialPlatform })
                          }
                        >
                          <SelectTrigger className="h-10 border-light-green/40 focus:ring-1 focus:ring-light-green/40 text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.keys(PLATFORM_LABELS) as SocialPlatform[]
                            ).map((p) => (
                              <SelectItem key={p} value={p}>
                                {PLATFORM_LABELS[p]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* URL Input with inside-X */}
                      <div className="space-y-1">
                        <p className="text-xs text-Primary/70">Profile Link</p>

                        <div className="relative">
                          <Input
                            value={row.url}
                            onChange={(e) =>
                              updateRow(row.id, { url: e.target.value })
                            }
                            placeholder="Enter the link"
                            className="h-10 border-light-green/40 focus-visible:ring-1 focus-visible:ring-light-green/40 pr-10 placeholder:text-xs"
                          />

                          {/* X inside input */}
                          <button
                            type="button"
                            onClick={() => removeRow(row.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center rounded-md hover:bg-light-green/10"
                            aria-label="Remove"
                            title="Remove"
                          >
                            <X className="w-4 h-4 text-Primary/60" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Another */}
                <button
                  type="button"
                  onClick={addRow}
                  className="w-full border border-dashed border-light-green/50 rounded-lg py-3 flex items-center justify-center gap-2 text-sm text-Primary hover:bg-light-green/5 transition"
                >
                  <Plus className="w-4 h-4 text-light-green" />
                  <span className="text-Primary">Add Another Brand Asset</span>
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BrandAssetsCard;
