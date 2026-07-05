import ws from "ws";

/**
 * Supabase realtime-js expects WebSocket on the server. Node 22+ has it built in;
 * on Node 20 we polyfill from the `ws` package before @nuxtjs/supabase initializes.
 */
export default defineNitroPlugin(() => {
  if (typeof globalThis.WebSocket === "undefined") {
    globalThis.WebSocket = ws as unknown as typeof WebSocket;
  }
});
