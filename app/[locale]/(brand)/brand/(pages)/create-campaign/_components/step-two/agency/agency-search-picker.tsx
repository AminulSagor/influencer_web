export type Agency = {
  id: string;
  name: string;
  subtitle: string;
};

type AgencySearchPickerProps = {
  value: string;
  setValue: (value: string) => void;
  suggestions: Agency[];
  setSuggestions: (value: Agency[]) => void;
  onSearch: (query: string) => void;
  onSelect: (agency: Agency) => void;
  error?: string;
};

const AgencySearchPicker = ({
  value,
  setValue,
  suggestions,
  setSuggestions,
  onSearch,
  onSelect,
  error,
}: AgencySearchPickerProps) => {
  return (
    <div className="relative space-y-2">
      <input
        value={value}
        onChange={(e) => {
          const nextValue = e.target.value;
          setValue(nextValue);

          if (nextValue.trim()) {
            onSearch(nextValue);
          } else {
            setSuggestions([]);
          }
        }}
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
