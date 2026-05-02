import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
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
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [tanstackStart(), react(), tailwindcss()],
});
