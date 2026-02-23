"use client";

type Props = {
  progress: number;
  bio: string | null;
};

export default function ProfileCompletionCard({ progress, bio }: Props) {
  const clamped = Math.max(0, Math.min(100, Number(progress || 0)));

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-Primary/10 text-Primary">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-black">Profile Completion</h3>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-Primary/10">
          <div
            className="h-3 rounded-full bg-Primary"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-primary/10 bg-off-white p-4">
        <div className="text-sm font-semibold text-black">Bio</div>
        <div className="mt-2 text-sm text-light-gray">
          {bio ? bio : "—"}
        </div>
      </div>
    </div>
  );
}