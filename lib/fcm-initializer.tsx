"use client";

import { getFcmToken } from "@/service/firebase/fcm-service";
import { registerFcmDevice } from "@/service/firebase/fcm-device-service";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth_store";

export default function FcmInitializer() {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const init = async () => {
      // Only register FCM token with the backend if the user is authenticated
      if (!token) return;

      const fcmToken = await getFcmToken();
      if (!fcmToken) return;

      try {
         await registerFcmDevice(fcmToken);
      } catch (err) {
        console.error("Failed to register FCM device:", err);
      }
    };

    init();
  }, [token]);

  return null;
}
