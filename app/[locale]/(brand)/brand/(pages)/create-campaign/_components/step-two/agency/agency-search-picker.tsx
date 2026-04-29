"use client";

import { useEffect } from "react";
import type { Agency } from "@/types/campaign/step2_campaign_type";

type AgencySearchPickerProps = {
  value: string;
  setValue: (value: string) => void;
  suggestions: Agency[];
  setSuggestions: (value: Agency[]) => void;
  onSearch: (query: string) => void;
  onSelect: (agency: Agency) => void;
  error?: string;
};

const SEARCH_DEBOUNCE_MS = 500;

const AgencySearchPicker = ({
  value,
  setValue,
  suggestions,
  setSuggestions,
  onSearch,
  onSelect,
  error,
}: AgencySearchPickerProps) => {
  useEffect(() => {
    const query = value.trim();

    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(() => {
      onSearch(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [onSearch, setSuggestions, value]);

  return (
    <div className="relative space-y-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search agency..."
        className={`h-12 w-full rounded border px-3 focus-visible:ring-1 ${
          error ? "border-red-500" : ""
        }`}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 max-h-60 w-full overflow-auto rounded border bg-white shadow">
          {suggestions.map((agency) => (
            <li
              key={agency.id}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => onSelect(agency)}
            >
              <p className="font-medium text-Primary">{agency.name}</p>
              <p className="text-sm text-gray-500">{agency.subtitle}</p>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AgencySearchPicker;
