"use client";

import { useEffect, useState } from "react";
export function useToken() {
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/get-token")
      .then((res) => res.json())
      .then((data) => {
        setToken(data.isAuthenticated);
        setLoading(false);
      });
  }, []);

  return { token, loading };
}
