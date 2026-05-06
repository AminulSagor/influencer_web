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

function SkeletonProgressCard({ itemCount = 6 }: { itemCount?: number }) {
  return (
    <section className="rounded-xl border bg-white px-5 py-5">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SkeletonCircle className="size-5" />
          <SkeletonLine className="h-5 w-44" />
        </div>

        <SkeletonLine className="h-5 w-5 rounded-full" />
      </div>

      <SkeletonLine className="mb-7 h-2 w-full rounded-full" />

      <div>
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <SkeletonCircle className="size-9" />

              {index !== itemCount - 1 && (
                <div className="h-10 w-px bg-gray-200" />
              )}
            </div>

            <div className="flex-1 pt-1">
              <SkeletonLine className="h-4 w-36" />
              <SkeletonLine className="mt-2 h-3 w-full max-w-[280px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function UnverifiedPageSkeleton() {
  return (
    <main className="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
      <section className="rounded-xl bg-white px-5 py-7 text-center shadow-sm">
        <SkeletonCircle className="mx-auto mb-3 size-5" />
        <SkeletonLine className="mx-auto h-5 w-36" />
        <SkeletonLine className="mx-auto mt-3 h-3 w-full max-w-[360px]" />
        <SkeletonLine className="mx-auto mt-2 h-3 w-full max-w-[300px]" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SkeletonProgressCard itemCount={8} />
        <SkeletonProgressCard itemCount={4} />
      </section>

      <section className="rounded-xl border bg-white px-5 py-5">
        <div className="mb-5 flex items-center gap-3">
          <SkeletonCircle className="size-5" />
          <SkeletonLine className="h-5 w-28" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SkeletonLine className="h-16 w-full rounded-lg" />
          <SkeletonLine className="h-16 w-full rounded-lg" />
        </div>
      </section>
    </main>
  );
}
