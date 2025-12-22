import { Target, Hourglass, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Lifetime Earnings",
    amount: "৳ 3,000,000",
    icon: Target,
    gradient: "from-[#5A7D3B] to-[#7FA35A]",
  },
  {
    title: "Pending Earnings",
    amount: "৳ 30,000",
    subtitle: "2 Campaigns",
    action: "View Pending Campaigns",
    icon: Hourglass,
    gradient: "from-[#5A7D3B] to-[#7FA35A]",
  },
  {
    title: "Recent Earning",
    amount: "৳ 30,000",
    subtitle: "Dec 12, 2025",
    icon: AlertCircle,
    light: true,
  },
];

export default function StatCards() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-2xl p-6 items-start gap-4 flex justify-between
            ${
              item.light
                ? "bg-[#F7FAEC] border border-[#E3EACD]"
                : `bg-linear-to-r ${item.gradient} text-white`
            }
          `}
        >
          <div className="space-y-2">
            <p
              className={`text-sm ${
                item.light ? "text-[#6B7A4C]" : "text-white/80"
              }`}
            >
              {item.title}
            </p>

            <h3 className="text-2xl font-semibold">{item.amount}</h3>

            {item.subtitle && (
              <p
                className={`text-sm ${
                  item.light ? "text-[#7A8A57]" : "text-white/80"
                }`}
              >
                {item.subtitle}
              </p>
            )}

            {item.action && (
              <button className="text-sm underline text-white/90 mt-1">
                {item.action} →
              </button>
            )}
          </div>

          <item.icon
            className={`w-6 h-6 ${
              item.light ? "text-[#7A8A57]" : "text-white"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
