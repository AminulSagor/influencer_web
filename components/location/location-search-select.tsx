"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { LocationListResponse, LocationLookupItem } from "@/types/common/location";

type LocationSearchSelectProps = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  fetchOptions: (params: {
    page: number;
    limit: number;
    search: string;
  }) => Promise<LocationListResponse>;
  onSelect: (item: LocationLookupItem) => void;
  limit?: number;
  className?: string;
};

const DEFAULT_META = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

const LocationSearchSelect = ({
  value,
  placeholder,
  disabled = false,
  fetchOptions,
  onSelect,
  limit = 20,
  className = "",
}: LocationSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<LocationLookupItem[]>([]);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!open || disabled) return;

    let isActive = true;

    const loadOptions = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetchOptions({
          page,
          limit,
          search: debouncedSearch,
        });

        if (!isActive) return;

        setItems(response.data ?? []);
        setMeta(response.meta ?? DEFAULT_META);
      } catch {
        if (!isActive) return;
        setItems([]);
        setMeta(DEFAULT_META);
        setError("Failed to load locations");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadOptions();

    return () => {
      isActive = false;
    };
  }, [debouncedSearch, disabled, fetchOptions, limit, open, page]);

  const totalPages = useMemo(
    () => Math.max(1, Number(meta.totalPages || 1)),
    [meta.totalPages],
  );

  const selectedValue = value?.trim() || "";

  return (
    <Popover open={open} onOpenChange={(nextOpen) => !disabled && setOpen(nextOpen)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`flex h-10 w-full items-center justify-between rounded-md border border-light-green/25 bg-white px-3 text-left text-sm outline-none transition focus-visible:ring-1 focus-visible:ring-light-green/30 disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-70 ${className}`}
        >
          <span className={selectedValue ? "text-foreground" : "text-muted-foreground"}>
            {selectedValue || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-9 pl-9"
            />
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : error ? (
            <div className="px-3 py-6 text-center text-sm text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No result found
            </div>
          ) : (
            items.map((item) => {
              const isSelected = item.name === selectedValue;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-light-green/10"
                >
                  <span>{item.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-light-green" />}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t p-2 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1 || isLoading}
            className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {Math.min(page, totalPages)} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages || isLoading}
            className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationSearchSelect;
