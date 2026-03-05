"use client";

export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 bg-light-green/30 rounded-full">
      <div className="h-full bg-light-green rounded-full transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
