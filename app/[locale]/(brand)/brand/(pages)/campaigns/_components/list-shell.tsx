"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ListShell({
  loading,
  empty,
  emptyTitle,
  children,
}: {
  loading?: boolean;
  empty?: boolean;
  emptyTitle: string;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4 xl:gap-8 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border border-border/70 bg-white shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="h-4 w-2/3 bg-muted rounded" />
              <div className="h-3 w-1/3 bg-muted rounded" />
              <div className="h-24 w-full bg-muted rounded-xl" />
              <div className="h-10 w-full bg-muted rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="w-full rounded-2xl border border-border/70 bg-white p-10 text-center mt-6">
        <p className="text-Primary font-semibold">{emptyTitle}</p>
        <p className="text-muted-foreground text-sm mt-1">
          Try changing the search keyword.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
