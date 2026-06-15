// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxtjs/supabase"],
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
  supabase: {
    redirect: false,
    redirectOptions: {
      callback: "/auth/confirm",
      exclude: ["/auth/confirm"],
    },
  },
  routeRules: {
    "/auth/confirm": { ssr: false },
  },
  runtimeConfig: {
    public: {
      forumApiUrl:
        process.env.NUXT_PUBLIC_FORUM_API_URL || "http://api.forum.test",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  icon: {
    mode: "svg",
  },
});
