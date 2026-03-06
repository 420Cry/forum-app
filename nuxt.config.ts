// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon"],
  css: ["./app/assets/css/main.css"],
  alias: {
    "@composables": resolve(currentDir, "app/composables"),
    "@components": resolve(currentDir, "app/components"),
    "@pages": resolve(currentDir, "app/pages"),
    "@layouts": resolve(currentDir, "app/layouts"),
    "@assets": resolve(currentDir, "app/assets"),
    "@plugins": resolve(currentDir, "app/plugins"),
    "@types": resolve(currentDir, "app/types"),
    "@constants": resolve(currentDir, "app/constants"),
  },
  runtimeConfig: {
    public: {
      forumApiUrl:
        process.env.NUXT_PUBLIC_FORUM_API_URL || "http://api.forum.test",
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "",
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "",
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
        messagingSenderId:
          process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "",
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  icon: {
    mode: "css",
    cssLayer: "fundedrIcon",
  },
});
