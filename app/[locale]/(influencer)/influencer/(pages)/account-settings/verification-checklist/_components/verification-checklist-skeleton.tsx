function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

function SkeletonCircle({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-full bg-gray-200 ${className}`} />
  );
}

function SkeletonStatusCard() {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-3">
          <SkeletonLine className="h-4 w-44" />
          <div className="flex items-center gap-2">
            <SkeletonCircle className="h-2 w-2" />
            <SkeletonLine className="h-3 w-20" />
          </div>
        </div>

        <SkeletonLine className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}

export function VerificationChecklistSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <section className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-4">
              <SkeletonCircle className="h-20 w-20 shrink-0" />

              <div className="space-y-3">
                <SkeletonLine className="h-5 w-40" />
                <SkeletonLine className="h-4 w-32" />
                <SkeletonLine className="h-5 w-24 rounded-md" />
              </div>
            </div>

            <div className="w-full space-y-3 sm:max-w-[240px]">
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-4/5" />
              <SkeletonLine className="h-4 w-3/4" />
              <SkeletonLine className="h-8 w-full rounded-lg sm:w-44" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <SkeletonLine className="h-5 w-48" />
          <SkeletonLine className="mt-3 h-4 w-full" />
          <SkeletonLine className="mt-2 h-4 w-3/4" />
        </div>
      </section>

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <SkeletonLine className="h-5 w-44" />
          <SkeletonLine className="h-4 w-10" />
        </div>
        <SkeletonLine className="h-2 w-full rounded-full" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonStatusCard key={index} />
        ))}
      </div>
    </div>
  );
}
