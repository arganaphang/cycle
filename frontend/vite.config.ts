import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET?.replace(/\/$/, "") ||
    "https://physiorehab.gbaajakarta.com";

  return {
  staged: { "*": "vp check --fix" },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@graphql-typed-document-node/core": path.resolve(
        __dirname,
        "src/shims/graphql-typed-document-node-core.ts",
      ),
    },
  },
  build: {
    rolldownOptions: {
      external: ["cloudflare:workers"],
    },
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/query": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  };
});
