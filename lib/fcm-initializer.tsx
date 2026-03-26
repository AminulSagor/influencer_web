"use client";

import { getFcmToken } from "@/service/firebase/fcm-service";
import { registerFcmDevice } from "@/service/firebase/fcm-device-service";
import { useEffect } from "react";

export default function FcmInitializer() {
  useEffect(() => {
    const init = async () => {
      const token = await getFcmToken();
      if (!token) return;

      try {
         await registerFcmDevice(token);
        
      } catch (err) {
        console.error("Failed to register FCM device:", err);
      }
    };

    init();
  }, []);

  return null;
}