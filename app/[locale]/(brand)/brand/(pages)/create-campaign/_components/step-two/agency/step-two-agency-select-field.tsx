import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StepTwoAgencySelectFieldProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const StepTwoAgencySelectField = ({
  label,
  options,
  value,
  onChange,
  error,
}: StepTwoAgencySelectFieldProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-Primary">{label}</h2>
        <Info className="h-4 w-4 text-gray-400" />
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`w-full focus-visible:ring-1 ${error ? "border-red-500" : ""}`}
        >
          <SelectValue placeholder="Select Niche Type" />
        </SelectTrigger>

        <SelectContent className="max-h-64">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default StepTwoAgencySelectField;