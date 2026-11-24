import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The admin app is a SEPARATE build served on its own port/subdomain.
// It is never linked from the public site and sends noindex headers in prod.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4001,
    proxy: { "/api": "http://localhost:4000", "/uploads": "http://localhost:4000" },
  },
  build: { outDir: "dist" },
});
