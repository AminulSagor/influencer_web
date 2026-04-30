import { Card, CardContent } from "@/components/ui/card";

interface Props {
  amount: string;
}

const formatCurrency = (value: string | number) => {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const TotalEarningCard = ({ amount }: Props) => {
  return (
    <Card className="h-full py-4">
      <CardContent className="h-full">
        <div className="border-light-green border p-4 rounded-lg bg-linear-to-r from-Secondary to-white min-h-[96px] h-full flex items-center">
          <div className="flex w-full justify-between items-center">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Campaign Earnings</p>
              <p className="text-2xl font-semibold text-Primary">
                ৳ {formatCurrency(amount)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border border-light-green flex items-center justify-center font-black text-light-green">
              ৳
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalEarningCard;