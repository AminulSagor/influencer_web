import { Input } from "@/components/ui/input";
import React from "react";

interface Props {
  text: string;
  amount: number;
  moneySymbol?: string;
  vat?: number;
  vatEditable?: boolean;
  onVatChange?: (value: number) => void;
}

const QuoteTextRow = ({
  amount,
  text,
  moneySymbol = "৳",
  vat,
  vatEditable = false,
  onVatChange,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <p>{text}</p>

        {vat !== undefined &&
          (vatEditable ? (
            <div className="relative w-20">
              <Input
                type="number"
                min={0}
                value={Number.isFinite(vat) ? String(vat) : "0"}
                onChange={(event) =>
                  onVatChange?.(Number(event.target.value || 0))
                }
                className="pr-6"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          ) : (
            <span className="rounded-md bg-[#F8F8F0] px-3 py-1 text-sm font-medium text-Primary">
              {vat}%
            </span>
          ))}
      </div>

      <p className="text-lg font-semibold text-light-green">
        {moneySymbol}
        {amount}
      </p>
    </div>
  );
};

export default QuoteTextRow;
