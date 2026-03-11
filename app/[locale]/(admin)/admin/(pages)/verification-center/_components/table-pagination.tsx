import Link from "next/link";
import type {
  VerificationMeta,
  VerificationTabKey,
} from "@/service/admin/verification-center/get-pending-profiles";

interface Props {
  meta: VerificationMeta;
  currentTab: VerificationTabKey;
}

const TablePagination = ({ meta, currentTab }: Props) => {
  const total = meta?.total ?? 0;
  const page = meta?.page ?? 1;
  const limit = meta?.limit ?? 10;
  const totalPages = meta?.totalPages ?? 1;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const createHref = (nextPage: number) =>
    `/admin/verification-center?tab=${currentTab}&page=${nextPage}`;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-4 py-5 text-sm text-gray-500">
      <div>
        Showing {start} - {end} of {total} Results
      </div>

      <div className="flex items-center gap-3">
        {page > 1 ? (
          <Link href={createHref(page - 1)} className="hover:text-Primary">
            Previous
          </Link>
        ) : (
          <span className="text-gray-300 cursor-not-allowed">Previous</span>
        )}

        <div className="flex items-center gap-2">
          {pages.map((item) => (
            <Link
              key={item}
              href={createHref(item)}
              className={`min-w-8 h-8 px-2 rounded-md flex items-center justify-center border ${
                item === page
                  ? "bg-[#7E9F4D] text-white border-[#7E9F4D]"
                  : "bg-white text-gray-600 border-transparent hover:border-gray-200"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {page < totalPages ? (
          <Link href={createHref(page + 1)} className="hover:text-Primary">
            Next
          </Link>
        ) : (
          <span className="text-gray-300 cursor-not-allowed">Next</span>
        )}
      </div>
    </div>
  );
};

export default TablePagination;