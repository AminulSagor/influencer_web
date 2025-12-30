import { Input } from "@/components/ui/input";
import React from "react";

interface Props {
  text: string;
  amount: number;
  moneySymbol?: string;
  vat?: number;
}

const QuoteTextRow = ({ amount, text, moneySymbol = "৳", vat }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p>{text}</p>

        {vat !== undefined && (
          <div className="relative w-20">
            <Input defaultValue={vat} />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        )}
      </div>

      <p className="text-lg font-semibold text-light-green">
        {moneySymbol}
        {amount}
      </p>
    </div>
  );
};

export default QuoteTextRow;
