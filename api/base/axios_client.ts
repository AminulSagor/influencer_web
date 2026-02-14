// api/base/axios_client.ts

import axios from "axios";
import { API_URL } from "@/config/env";
import { getToken, removeToken } from "@/utils/cookies_util";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Bearer token attached");
    } else {
      console.log("❌ No token found in cookie");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔴 401 Unauthorized - clearing auth");

      removeToken();

      if (typeof window !== "undefined") {
        const locale =
          document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || "en";

        if (!window.location.pathname.includes("/login")) {
          window.location.href = `/${locale}/login`;
        }
      }
    }

    return Promise.reject(error);
  }
);
