"use client";

import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notifyError } from "@/utils/toast_util";
import { CampaignService } from "@/service/campaign/campaign-service";
import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";

type FieldErrors = Partial<
  Record<"productType" | "campaignNiche" | "preferred" | "notPreferred", string>
>;

type Influencer = { id: string; fullName: string };

const StepTwoInfluencer = () => {
  const { increaseStep, decreaseStep } = useCampaignStore();

  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [campaignNiches, setCampaignNiches] = useState<string[]>([]);

  const [productType, setProductType] = useState("");
  const [campaignNiche, setCampaignNiche] = useState("");

  const [preferredInput, setPreferredInput] = useState("");
  const [notPreferredInput, setNotPreferredInput] = useState("");

  const [preferred, setPreferred] = useState<Influencer[]>([]);
  const [notPreferred, setNotPreferred] = useState<Influencer[]>([]);

  const [preferredSuggestions, setPreferredSuggestions] = useState<Influencer[]>([]);
  const [notPreferredSuggestions, setNotPreferredSuggestions] = useState<Influencer[]>([]);

   const campaignId = useCampaignStore((s) => s.campaignId); // get campaignId from store

  const [errors, setErrors] = useState<FieldErrors>({});

  // ==================== Fetch product types and niches ====================
  useEffect(() => {
    (async () => {
      try {
        setProductTypes(await CampaignService.getProductTypes());
      } catch (err: any) {
        notifyError(err.message || "Failed to load product types");
      }
      try {
        setCampaignNiches(await CampaignService.getCampaignNiches());
      } catch (err: any) {
        notifyError(err.message || "Failed to load campaign niches");
      }
    })();
  }, []);

  // ==================== Influencer search ====================
  const searchInfluencers = async (query: string, forPreferred: boolean) => {
    if (!query.trim()) return;
    try {
      const res = await serviceClient.get("/client/search/influencers", { params: { query } });
      const data: Influencer[] = res.data || [];
      if (forPreferred) setPreferredSuggestions(data);
      else setNotPreferredSuggestions(data);
    } catch (err: any) {
      console.error("Influencer search failed:", err);
    }
  };

  // ==================== Helpers ====================
  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateAll = () => {
    const nextErrors: FieldErrors = {};
    if (!productType) nextErrors.productType = "Please select a product type.";
    if (!campaignNiche) nextErrors.campaignNiche = "Please select a campaign niche.";
    if (preferred.length === 0) nextErrors.preferred = "Add at least 1 preferred influencer.";
    if (notPreferred.length === 0) nextErrors.notPreferred = "Add at least 1 not preferable influencer.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onNext = async () => {
    if (!validateAll()) return;

    try {
      await CampaignService.updateStepTwo(campaignId, {
        productType,
        campaignNiche,
        preferredInfluencerIds: preferred.map((i) => i.id),
        notPreferableInfluencerIds: notPreferred.map((i) => i.id),
      });
      //console.log(campaignId);
      increaseStep();
    } catch (err: any) {
      notifyError(err.message || "Failed to save step 2");
      console.error(err);
    }
  };

  // ==================== Render ====================
  return (
    <Card className="border-none relative">
      <CardContent className="space-y-8">

        {/* Product Type */}
        <SelectField
          label="Product Type"
          options={productTypes}
          value={productType}
          onChange={(v) => { setProductType(v); clearError("productType"); }}
          error={errors.productType}
        />

        {/* Campaign Niche */}
        <SelectField
          label="Campaign Niche"
          options={campaignNiches}
          value={campaignNiche}
          onChange={(v) => { setCampaignNiche(v); clearError("campaignNiche"); }}
          error={errors.campaignNiche}
        />

        {/* Preferred Influencers */}
        <InfluencerInput
          label="Preferred Influencers"
          value={preferredInput}
          setValue={setPreferredInput}
          selected={preferred}
          setSelected={setPreferred}
          suggestions={preferredSuggestions}
          setSuggestions={setPreferredSuggestions}
          clearError={() => clearError("preferred")}
          searchFn={searchInfluencers}
        />

        {/* Not Preferable Influencers */}
        <InfluencerInput
          label="Not Preferable Influencers"
          value={notPreferredInput}
          setValue={setNotPreferredInput}
          selected={notPreferred}
          setSelected={setNotPreferred}
          suggestions={notPreferredSuggestions}
          setSuggestions={setNotPreferredSuggestions}
          clearError={() => clearError("notPreferred")}
          searchFn={searchInfluencers}
        />

        {/* Footer Buttons */}
        <div className="mt-10 flex justify-end gap-4">
          <SecondaryButton onClick={decreaseStep}>Previous</SecondaryButton>
          <PrimaryButton onClick={onNext}>Next</PrimaryButton>
        </div>

      </CardContent>
    </Card>
  );
};

export default StepTwoInfluencer;



interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}
const SelectField = ({ label, options, value, onChange, error }: SelectFieldProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <h2 className="text-base font-semibold text-Primary">{label}</h2>
      <Info className="w-4 h-4 text-gray-400" />
    </div>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`focus-visible:ring-1 w-full ${error ? "border-red-500" : ""}`}>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

interface InfluencerInputProps {
  label: string;
  value: string;
  setValue: (v: string) => void;
  selected: Influencer[];
  setSelected: (v: Influencer[]) => void;
  suggestions: Influencer[];
  setSuggestions: (v: Influencer[]) => void;
  clearError: () => void;
  searchFn: (query: string, forPreferred: boolean) => void;
}

const InfluencerInput = ({
  label,
  value,
  setValue,
  selected,
  setSelected,
  suggestions,
  setSuggestions,
  clearError,
  searchFn,
}: InfluencerInputProps) => {

  const addInfluencer = (inf: Influencer) => {
    if (!selected.find((s) => s.id === inf.id)) setSelected([...selected, inf]);
    setValue("");
    setSuggestions([]);
    clearError();
  };

  return (
    <div className="space-y-3 relative">
      <h2 className="text-base font-semibold text-Primary">{label}</h2>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value) searchFn(e.target.value, label.includes("Preferred"));
        }}
        placeholder="Type influencer name..."
        className="h-12 focus-visible:ring-1 placeholder:text-sm"
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-auto">
          {suggestions.map((inf) => (
            <li key={inf.id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => addInfluencer(inf)}>
              {inf.fullName}
            </li>
          ))}
        </ul>
      )}

      <TagBox
        tags={selected.map((s) => s.fullName)}
        onRemove={(name) => setSelected(selected.filter((s) => s.fullName !== name))}
      />
    </div>
  );
};

const TagBox = ({ tags, onRemove }: { tags: string[]; onRemove: (tag: string) => void }) => (
  <div className="flex flex-wrap gap-2 rounded-xl border border-light-gray p-3 min-h-44">
    {tags.map((tag) => (
      <span key={tag} className="flex items-center gap-1 rounded-full bg-Secondary px-3 py-1 text-sm text-Primary h-8">
        {tag}
        <button type="button" onClick={() => onRemove(tag)} aria-label={`Remove ${tag}`} className="opacity-60 hover:opacity-100">
          <X className="w-3.5 h-3.5 cursor-pointer" />
        </button>
      </span>
    ))}
  </div>
);
