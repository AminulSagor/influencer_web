"use client";

import { useEffect, useState } from "react";

import { getAllInfluencers } from "@/api/admin/users/get-all-influencers";
import type { InfluencerListItem } from "@/types/admin/user/influencer-list_type";
import VerificationBreadcrumb from "../../_components/verification-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard from "../../_components/user-card";

export default function InfluencerUsersClient() {
  const [users, setUsers] = useState<InfluencerListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getAllInfluencers({ page: 1, limit: 10 });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="influencer" name="Hania amir" />
      <VariantLinksCard />
      <UserCard users={users} />
      {loading ? <div className="text-sm text-light-gray">Loading...</div> : null}
    </div>
  );
}