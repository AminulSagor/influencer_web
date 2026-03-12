"use client";

type Props = {
  value: number;
};

export default function SubmissionPerformanceRing({ value }: Props) {
  const normalized = Math.max(0, Math.min(value, 999));
  const degree = Math.min((Math.min(normalized, 100) / 100) * 360, 360);

  return (
    <div className="flex items-center justify-center xl:justify-end">
      <div className="text-center">
        <p className="mb-4 text-sm font-medium text-black">
          Average Performance
        </p>

        <div
          className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#7BA35A ${degree}deg, #DCE7CC ${degree}deg)`,
          }}
        >
          <div className="flex h-[90px] w-[90px] items-center justify-center rounded-full bg-white text-[18px] font-semibold text-black">
            {normalized}%
          </div>
        </div>
      </div>
    </div>
  );
}