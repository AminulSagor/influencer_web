import SelectedTagsBox from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/influencer/selected-tags-box";
import { Input } from "@/components/ui/input";
import type { KeyboardEvent } from "react";
type Influencer = { id: string; fullName: string };

type InfluencerPickerProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  selected: Influencer[];
  setSelected: (value: Influencer[]) => void;
  suggestions: Influencer[];
  setSuggestions: (value: Influencer[]) => void;
  onSearch: (query: string) => void;
  onClearError: () => void;
  error?: string;
};

const InfluencerPicker = ({
  label,
  value,
  setValue,
  selected,
  setSelected,
  suggestions,
  setSuggestions,
  onSearch,
  onClearError,
  error,
}: InfluencerPickerProps) => {
  const normalizeName = (name: string) => name.trim().toLowerCase();

  const addInfluencer = (influencer: Influencer) => {
    const exists = selected.some(
      (item) =>
        item.id === influencer.id ||
        normalizeName(item.fullName) === normalizeName(influencer.fullName)
    );

    if (!exists) {
      setSelected([...selected, influencer]);
    }

    setValue("");
    setSuggestions([]);
    onClearError();
  };

  const addTypedInfluencers = (names: string[], nextInputValue = "") => {
    const cleanedNames = names.map((name) => name.trim()).filter(Boolean);

    if (cleanedNames.length === 0) {
      setValue(nextInputValue);
      return;
    }

    const nextSelected = [...selected];

    cleanedNames.forEach((name) => {
      const exists = nextSelected.some(
        (item) => normalizeName(item.fullName) === normalizeName(name)
      );

      if (!exists) {
        nextSelected.push({
          id: `custom-${normalizeName(name).replace(/\s+/g, "-")}`,
          fullName: name,
        });
      }
    });

    setSelected(nextSelected);
    setValue(nextInputValue);
    setSuggestions([]);
    onClearError();
  };

  const handleInputChange = (nextValue: string) => {
    if (nextValue.includes(",")) {
      const parts = nextValue.split(",");
      const remainingValue = parts[parts.length - 1] ?? "";
      addTypedInfluencers(parts.slice(0, -1), remainingValue);

      if (remainingValue.trim()) {
        onSearch(remainingValue);
      }

      return;
    }

    setValue(nextValue);

    if (nextValue.trim()) {
      onSearch(nextValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addTypedInfluencers([value]);
  };

  const removeInfluencer = (fullName: string) => {
    setSelected(selected.filter((item) => item.fullName !== fullName));
  };

  return (
    <div className="relative space-y-3">
      <h2 className="text-base font-semibold text-Primary">{label}</h2>

      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder="Type influencer name..."
        className={`h-12 placeholder:text-sm focus-visible:ring-1 ${
          error ? "border-red-500" : ""
        }`}
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 max-h-60 w-full overflow-auto rounded border bg-white shadow">
          {suggestions.map((influencer) => (
            <li
              key={influencer.id}
              className="cursor-pointer p-2 hover:bg-gray-100"
              onClick={() => addInfluencer(influencer)}
            >
              {influencer.fullName}
            </li>
          ))}
        </ul>
      )}

      <SelectedTagsBox
        tags={selected.map((item) => item.fullName)}
        onRemove={removeInfluencer}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InfluencerPicker;
