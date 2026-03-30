"use client";

type Props = {
  value: number;
};

export default function SubmissionPerformanceRing({ value }: Props) {
  const hasPerformance = value > 0;
  const normalized = Math.max(0, Math.min(value, 999));
  const ringValue = Math.min(normalized, 100);
  const degree = (ringValue / 100) * 360;

  return (
    <div className="flex items-center justify-center xl:justify-end">
      <div className="text-center">
        <p className="mb-4 text-sm font-medium text-black">
          Average Performance
        </p>

        <div
          className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full"
          style={{
            background: hasPerformance
              ? `conic-gradient(#7BA35A ${degree}deg, #DCE7CC ${degree}deg)`
              : "conic-gradient(#DCE7CC 360deg, #DCE7CC 360deg)",
          }}
        >
          <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-white text-base font-semibold text-black">
            {hasPerformance ? `${normalized}%` : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
}
