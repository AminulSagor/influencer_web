"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformIcon from "./platform-icon";
import { Badge } from "@/components/ui/badge";
import BrandCardItem from "./brand-card-item";
import { BrandListItem, ListMeta } from "@/types/admin/user/user_type";

function capitalizeFirstLetter(text?: string): string {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
}

interface Props {
  users: BrandListItem[];
  meta?: ListMeta;
}

const BrandUserCard = ({ users, meta }: Props) => {
  const [view, setView] = useState<"list" | "grid">("list");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const url = pathname.split("/").pop();
  const cardTitle = capitalizeFirstLetter(url);

  const [searchText, setSearchText] = useState(searchParams.get("search") ?? "");

  const activeTab = useMemo<"all" | "blocked">(() => {
    const status = searchParams.get("status");
    return status === "blocked" ? "blocked" : "all";
  }, [searchParams]);

  const sortBy = searchParams.get("sortBy") ?? "";
  const minJobsPlaced = searchParams.get("minJobsPlaced") ?? "";
  const minSpent = searchParams.get("minSpent") ?? "";

  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.total ?? 0;
  const limit = meta?.limit ?? 10;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * limit, totalItems);

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!("page" in updates)) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = () => {
    updateQuery({
      search: searchText.trim() || null,
    });
  };

  const handleTabChange = (tab: "all" | "blocked") => {
    updateQuery({
      status: tab === "blocked" ? "blocked" : null,
    });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    updateQuery({
      page: String(page),
    });
  };

  const visiblePages = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  const getButtonClass = (tab: "all" | "blocked") =>
    activeTab === tab
      ? "bg-light-green text-white px-3 py-1 rounded-full px-6"
      : "text-Primary";

  const baseBtn =
    "bg-Secondary text-light-green border border-light-green hover:bg-Secondary/90 hover:text-light-green";
  const activeBtn =
    "bg-light-green text-white hover:bg-light-green/90 hover:text-white";

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-Primary">{cardTitle}</CardTitle>
            <CardDescription>
              Browse brand and their details
              {meta ? ` • ${meta.total} total` : ""}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="link"
              className={getButtonClass("all")}
              onClick={() => handleTabChange("all")}
            >
              All
            </Button>

            <Button
              variant="link"
              className={getButtonClass("blocked")}
              onClick={() => handleTabChange("blocked")}
            >
              Blocked
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4 mx-2">
          <div className="flex-1">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Search by brand name, phone or email..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-x-2">
            <Button
              className={cn(baseBtn, view === "list" && activeBtn)}
              onClick={() => setView("list")}
            >
              List View
            </Button>

            <Button
              className={cn(baseBtn, view === "grid" && activeBtn)}
              onClick={() => setView("grid")}
            >
              Grid View
            </Button>
          </div>
        </div>

        <div className="border border-light-green bg-Secondary p-2 rounded-md mx-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
                1 Selected
              </div>

              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[180px]">
                  <SelectValue placeholder="Bulk Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="bg-light-green text-white hover:bg-light-green/90"
                onClick={handleSearch}
              >
                Go
              </Button>
            </div>

            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[140px]">
                  <SelectValue placeholder="Niche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy || "all"}
                onValueChange={(value) =>
                  updateQuery({
                    sortBy: value === "all" ? null : value,
                  })
                }
              >
                <SelectTrigger className="bg-white border border-light-green text-sm w-[190px]">
                  <SelectValue placeholder="Revenue Generated" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Revenue Generated</SelectItem>
                  <SelectItem value="revenue">Highest Revenue</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm w-[160px]">
                  <SelectValue placeholder="Nov 20 - Dec 20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-range">Nov 20 - Dec 20</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={minJobsPlaced || "all"}
                onValueChange={(value) =>
                  updateQuery({
                    minJobsPlaced: value === "all" ? null : value,
                  })
                }
              >
                <SelectTrigger className="bg-white border border-light-green text-sm w-[140px]">
                  <SelectValue placeholder="Job Placed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Job Placed</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="10">10+</SelectItem>
                  <SelectItem value="25">25+</SelectItem>
                  <SelectItem value="50">50+</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={minSpent || "all"}
                onValueChange={(value) =>
                  updateQuery({
                    minSpent: value === "all" ? null : value,
                  })
                }
              >
                <SelectTrigger className="bg-white border border-light-green text-sm w-[160px]">
                  <SelectValue placeholder="Total Spent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Total Spent</SelectItem>
                  <SelectItem value="10000">10,000+</SelectItem>
                  <SelectItem value="50000">50,000+</SelectItem>
                  <SelectItem value="100000">100,000+</SelectItem>
                  <SelectItem value="500000">500,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {view === "list" ? (
          <div className="rounded-md overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow className="bg-light-green hover:bg-light-green">
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-white">Brand</TableHead>
                  <TableHead className="text-white">Niche</TableHead>
                  <TableHead className="text-white">Platforms</TableHead>
                  <TableHead className="text-white text-center">
                    Job Placed
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Total Spent
                  </TableHead>
                  <TableHead className="text-white text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/users/brand/${user.userId}`}
                        className="flex items-center gap-3 hover:opacity-80 transition"
                      >
                        <Avatar>
                          <AvatarImage src={user.image ?? ""} />
                          <AvatarFallback>
                            {user.name?.[0]?.toUpperCase() ?? "B"}
                          </AvatarFallback>
                        </Avatar>
                        <p>{user.name}</p>
                      </Link>
                    </TableCell>

                    <TableCell>
                      {user.niche.length ? user.niche.join(", ") : "—"}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {user.platforms.map((platform, index) => (
                          <PlatformIcon
                            className="text-light-green"
                            key={`${user.id}-${platform}-${index}`}
                            size={18}
                            platform={platform}
                          />
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-semibold">
                      {user.jobPlaced}
                    </TableCell>

                    <TableCell className="text-center font-semibold">
                      ৳{user.totalSpent.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={
                          user.status === "Approved"
                            ? "lightGreen"
                            : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No brands found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {meta && totalItems > 0 && (
              <div className="flex items-center justify-between px-6 py-5 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {startItem} - {endItem} of {totalItems} Campaigns
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 text-muted-foreground"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>

                  {visiblePages.map((page) => (
                    <Button
                      key={page}
                      variant="ghost"
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "h-8 min-w-8 px-0",
                        currentPage === page
                          ? "bg-light-green text-white hover:bg-light-green/90"
                          : "text-Primary"
                      )}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    className="h-8 px-2 text-muted-foreground"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-2">
            {users.map((user) => (
              <BrandCardItem brand={user} key={user.id} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandUserCard;