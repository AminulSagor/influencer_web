import Loader from "@/components/spin-loader";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="rounded-2xl border border-light-gray bg-white p-6 lg:col-span-3">
          <div className="min-h-[220px] animate-pulse rounded-2xl bg-black/5" />
        </div>

        <div className="rounded-2xl border border-light-gray bg-white p-6 lg:col-span-4">
          <div className="min-h-[220px] animate-pulse rounded-2xl  bg-black/5" />
        </div>
      </div>

      <div className="rounded-2xl  border border-light-gray bg-white p-6">
        <div className="flex min-h-[180px] items-center justify-center">
          <Loader />
        </div>
      </div>

      <div className="rounded-2xl  border border-light-gray bg-white p-6">
        <div className="min-h-[220px] animate-pulse rounded-2xl ] bg-black/5" />
      </div>
    </div>
  );
}
