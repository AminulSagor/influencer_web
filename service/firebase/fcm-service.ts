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

    // Register service worker manually
    await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    
    // Specifically wait for the service worker to become active and ready
    const readySwRegistration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: readySwRegistration,
    });
    return token;
  } catch (e: any) {
    if (e?.code === 'messaging/unsupported-browser' || (typeof navigator !== 'undefined' && 'brave' in navigator)) {
      console.warn("FCM: Push messaging is blocked. If you are on Brave, enable 'Use Google Services for Push Messaging' in brave://settings/privacy");
    } else {
      console.error("Error getting FCM token:", e);
    }
    return null;
  }
}