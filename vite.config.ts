// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages only serves static files, so when the GITHUB_PAGES env var is set
// (done by .github/workflows/deploy.yml) we build a static single-page app instead
// of the server build Lovable uses. Normal Lovable / local dev is unaffected.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const BASE = "/Personal-Dashboard/"; // must match the GitHub repository name

export default defineConfig(
  isGitHubPages
    ? {
        nitro: false,
        vite: { base: BASE },
        tanstackStart: {
          router: { basepath: BASE },
          spa: { enabled: true },
        },
      }
    : {
        tanstackStart: {
          // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
          // nitro/vite builds from this
          server: { entry: "server" },
        },
      },
);
