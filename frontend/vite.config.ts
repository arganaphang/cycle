import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  staged: { "*": "vp check --fix" },
  resolve: {
    tsconfigPaths: true,
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [tanstackStart(), react(), tailwindcss()],
});
