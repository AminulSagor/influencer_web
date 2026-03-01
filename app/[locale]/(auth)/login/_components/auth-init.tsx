"use client";

import { initAuth } from "@/utils/init_auth_util";
import { useEffect } from "react";

export default function AuthInit({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAuth();
  }, []);

  return <>{children}</>;
}
