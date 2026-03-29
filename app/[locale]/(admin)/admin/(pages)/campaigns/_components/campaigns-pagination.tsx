"use client";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  showingFrom: number;
  showingTo: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
};

export default function CampaignsPagination({
  currentPage,
  totalPages,
  totalItems,
  showingFrom,
  showingTo,
  itemLabel = "Items",
  onPageChange,
}: Props) {
  if (totalPages <= 1 && totalItems === 0) return null;

  const getPages = () => {
    const pages: number[] = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getPages();

  return (
    <div className="flex flex-col gap-4 px-2 py-2 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {showingFrom} - {showingTo} of {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {visiblePages.map((page) => {
            const active = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={
                  active
                    ? "flex h-8 w-8 items-center justify-center rounded-md bg-light-green text-white"
                    : "flex h-8 w-8 items-center justify-center rounded-md text-black"
                }
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}