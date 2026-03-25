"use client";

import app from "@/lib/firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export async function getFcmToken() {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const supported = await isSupported();

    if (!supported) return null;


    const permission = await Notification.requestPermission();

    if (permission !== "granted") return null;

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (e) {
    return null;
  }
}