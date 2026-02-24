"use client";

import { useEffect, useState } from "react";

import VerificationBreadcrumb from "../../_components/verification-breadcrumb";
import VariantLinksCard from "../../_components/variants-links-card";
import UserCard, { ClientRow } from "../../_components/user-card";
import { getAllClients } from "@/api/admin/users/clients/get-all-clients";

export default function ClientsUsersClient() {
  const [users, setUsers] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        setLoading(true);
        const res = await getAllClients({ page: 1, limit: 10 });
        if (!alive) return;
        setUsers(res.data ?? []);
      } catch (err) {
        console.error("❌ getAllClients error:", err);
        if (!alive) return;
        setUsers([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <VerificationBreadcrumb type="agency" name="Clients" />
      <VariantLinksCard />

      {loading ? (
        <div className="text-sm text-light-gray">Loading...</div>
      ) : null}

      <UserCard variant="client" users={users} />
    </div>
  );
}