import { ChevronRight, Headphones, MessageCircleQuestion } from "lucide-react";

export function NeedHelpCard() {
  const items = [
    {
      label: "Verification Guide",
      icon: MessageCircleQuestion,
    },
    {
      label: "Contact Support",
      icon: Headphones,
    },
  ];

  return (
    <section className="rounded-xl border bg-white px-5 py-5">
      <div className="mb-5 flex items-center gap-3">
        <MessageCircleQuestion className="size-5 fill-[#416f2e] text-white" />
        <h2 className="text-base font-semibold text-[#254b19]">Need Help?</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="flex min-h-[64px] items-center justify-between rounded-lg border bg-white px-5 text-left transition hover:bg-[#f7faf5]"
            >
              <span className="flex items-center gap-4 text-sm font-medium text-[#6d944b]">
                <Icon className="size-5" />
                {item.label}
              </span>

              <ChevronRight className="size-5 text-[#777]" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
