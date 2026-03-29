importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(clients.claim());
});

firebase.initializeApp({
  apiKey: "AIzaSyBHG5uGw2AOxh1Vt9caLzaEUH6K7MM8mzg",
  authDomain: "brandguru-4016e.firebaseapp.com",
  projectId: "brandguru-4016e",
  storageBucket: "brandguru-4016e.firebasestorage.app",
  messagingSenderId: "72364811038",
  appId: "1:72364811038:web:ec04c1f92a93e9449b5f0f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "BrandGuru";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
