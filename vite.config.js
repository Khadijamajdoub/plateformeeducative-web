import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ accepte connexions externes (ngrok)
    port: 5181,
    strictPort: true,

    allowedHosts: [
      "hypothecary-elli-uncalorific.ngrok-free.dev",
    ],

    // ✅ HMR compatible ngrok https
    hmr: {
      protocol: "wss",
      host: "hypothecary-elli-uncalorific.ngrok-free.dev",
      clientPort: 443,
    },
  },
});
