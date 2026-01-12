"use client";

import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info, X } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAMPAIGN_NICHES,
  PRODUCT_TYPES,
} from "@/app/[locale]/(brand)/brand/dummy-data/niche-and-productType-data";

type FieldErrors = Partial<
  Record<"productType" | "campaignNiche" | "preferred" | "notPreferred", string>
>;

const StepTwoInfluencer = () => {
  const { increaseStep, decreaseStep } = useCampaignStore();

  const [productType, setProductType] = useState<string>("");
  const [campaignNiche, setCampaignNiche] = useState<string>("");

  const [preferredInput, setPreferredInput] = useState("");
  const [notPreferredInput, setNotPreferredInput] = useState("");

  const [preferred, setPreferred] = useState<string[]>([]);
  const [notPreferred, setNotPreferred] = useState<string[]>([]);

  const [errors, setErrors] = useState<FieldErrors>({});

  const normalizeName = (v: string) => v.trim().replace(/\s+/g, " ");

  const splitToNames = (raw: string) =>
    raw
      .split(",")
      .map((x) => normalizeName(x))
      .filter(Boolean);

  const addNames = (
    raw: string,
    current: string[],
    setter: (v: string[]) => void
  ) => {
    const incoming = splitToNames(raw);
    if (!incoming.length) return current;

    const existingLower = new Set(current.map((x) => x.toLowerCase()));
    const next = [...current];

    for (const name of incoming) {
      const key = name.toLowerCase();
      if (existingLower.has(key)) continue;
      next.push(name);
      existingLower.add(key);
    }

    setter(next);
    return next;
  };

  const removeTag = (
    tag: string,
    current: string[],
    setter: (v: string[]) => void
  ) => {
    const key = tag.toLowerCase();
    setter(current.filter((t) => t.toLowerCase() !== key));
  };

  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateAll = (pref: string[], notPref: string[]) => {
    const nextErrors: FieldErrors = {};

    if (!productType) nextErrors.productType = "Please select a product type.";
    if (!campaignNiche)
      nextErrors.campaignNiche = "Please select a campaign niche.";

    // you said “add all field validation” → making both required
    if (pref.length === 0)
      nextErrors.preferred = "Please add at least 1 preferred influencer.";
    if (notPref.length === 0)
      nextErrors.notPreferred =
        "Please add at least 1 not preferable influencer.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onNext = () => {
    // capture typed names even if user didn’t press Enter
    let prefNow = preferred;
    let notPrefNow = notPreferred;

    if (preferredInput.trim()) {
      prefNow = addNames(preferredInput, prefNow, setPreferred);
      setPreferredInput("");
    }

    if (notPreferredInput.trim()) {
      notPrefNow = addNames(notPreferredInput, notPrefNow, setNotPreferred);
      setNotPreferredInput("");
    }

    const ok = validateAll(prefNow, notPrefNow);
    if (!ok) return;

    increaseStep();
  };

  return (
    <Card className="border-none">
      <CardContent className="space-y-8">
        {/* ================= Select Product Type ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Select Product Type
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <Select
            value={productType}
            onValueChange={(v) => {
              setProductType(v);
              clearError("productType");
            }}
          >
            <SelectTrigger
              className={[
                "focus-visible:ring-1 w-full",
                errors.productType ? "border-red-500" : "",
              ].join(" ")}
            >
              <SelectValue placeholder="Select Product Type" />
            </SelectTrigger>

            <SelectContent className="max-h-64">
              {PRODUCT_TYPES.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.productType && (
            <p className="text-sm text-red-500">{errors.productType}</p>
          )}
        </div>

        {/* ================= Campaign Niche ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Campaign Niche
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <Select
            value={campaignNiche}
            onValueChange={(v) => {
              setCampaignNiche(v);
              clearError("campaignNiche");
            }}
          >
            <SelectTrigger
              className={[
                "focus-visible:ring-1 w-full",
                errors.campaignNiche ? "border-red-500" : "",
              ].join(" ")}
            >
              <SelectValue placeholder="Select Niche Type" />
            </SelectTrigger>

            <SelectContent className="max-h-64">
              {CAMPAIGN_NICHES.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.campaignNiche && (
            <p className="text-sm text-red-500">{errors.campaignNiche}</p>
          )}
        </div>

        {/* ================= Preferred Influencers ================= */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-Primary">
            Preferred Influencers
          </h2>

          <Input
            value={preferredInput}
            onChange={(e) => {
              setPreferredInput(e.target.value);
              if (preferred.length > 0) clearError("preferred");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!preferredInput.trim()) return;
                const next = addNames(preferredInput, preferred, setPreferred);
                setPreferredInput("");
                if (next.length > 0) clearError("preferred");
              }
            }}
            placeholder="Enter Influencers Names... (Separate Each With A Comma)"
            className={[
              "h-12 focus-visible:ring-1 placeholder:text-sm",
              errors.preferred ? "border-red-500" : "",
            ].join(" ")}
          />

          <TagBox
            tags={preferred}
            onRemove={(tag) => {
              removeTag(tag, preferred, setPreferred);
              // if user removes to empty, keep error only when pressing Next
              clearError("preferred");
            }}
          />

          {errors.preferred && (
            <p className="text-sm text-red-500">{errors.preferred}</p>
          )}
        </div>

        {/* ================= Not Preferable Influencers ================= */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-Primary">
            Not Preferable Influencers
          </h2>

          <Input
            value={notPreferredInput}
            onChange={(e) => {
              setNotPreferredInput(e.target.value);
              if (notPreferred.length > 0) clearError("notPreferred");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!notPreferredInput.trim()) return;
                const next = addNames(
                  notPreferredInput,
                  notPreferred,
                  setNotPreferred
                );
                setNotPreferredInput("");
                if (next.length > 0) clearError("notPreferred");
              }
            }}
            placeholder="Enter Influencers Names... (Separate Each With A Comma)"
            className={[
              "h-12 focus-visible:ring-1 placeholder:text-sm",
              errors.notPreferred ? "border-red-500" : "",
            ].join(" ")}
          />

          <TagBox
            tags={notPreferred}
            onRemove={(tag) => {
              removeTag(tag, notPreferred, setNotPreferred);
              clearError("notPreferred");
            }}
          />

          {errors.notPreferred && (
            <p className="text-sm text-red-500">{errors.notPreferred}</p>
          )}
        </div>
        <div className="mt-10 flex justify-end">
          <div className="flex gap-4">
            <SecondaryButton onClick={() => decreaseStep()}>
              Previous
            </SecondaryButton>

            <PrimaryButton className="px-8" onClick={increaseStep}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepTwoInfluencer;

const TagBox = ({
  tags,
  onRemove,
}: {
  tags: string[];
  onRemove: (tag: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-light-gray p-3 min-h-44">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-Secondary px-3 py-1 text-sm text-Primary h-8"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            aria-label={`Remove ${tag}`}
            className="opacity-60 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5 cursor-pointer" />
          </button>
        </span>
      ))}
    </div>
  );
};
