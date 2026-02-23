"use client";

import { getAdminUserCounts } from "@/api/admin/users/get-users-count";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const VariantLinksCard = () => {
  const pathname = usePathname();

  const [counts, setCounts] = useState({
    influencer: 0,
    agency: 0,
    brand: 0,
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const res = await getAdminUserCounts();
        setCounts(res);
      } catch (e) {
        console.error(e);
      }
    };
    loadCounts();
  }, []);

  const linksData = [
    { id: 1, title: "Influencer", count: counts.influencer, url: "/admin/users/influencer" },
    { id: 2, title: "Agency", count: counts.agency, url: "/admin/users/agency" },
    { id: 3, title: "Brand", count: counts.brand, url: "/admin/users/brand" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {linksData.map((link) => {
        const lastSegment = link.url.split("/").pop() ?? "";
        const isActive = pathname.endsWith(lastSegment);

        return (
          <Link
            key={link.id}
            href={link.url}
            className={`border rounded-md col-span-12 md:col-span-4 p-4 transition
              ${
                isActive
                  ? "bg-linear-to-r from-Primary to-light-green"
                  : "bg-linear-to-r from-white to-Secondary"
              }`}
          >
            <div className="space-y-2">
              <p
                className={cn(
                  "text-light-green text-lg",
                  isActive && "text-white-two"
                )}
              >
                {link.title}
              </p>

              <p
                className={cn(
                  "text-Primary text-2xl font-bold",
                  isActive && "text-white-two"
                )}
              >
                {link.count}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default VariantLinksCard;