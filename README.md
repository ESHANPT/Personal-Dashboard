# Pixel Perfect

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/48302389-2c46-4af9-af3e-3d6d3a6e4f77).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deploy to GitHub Pages

This repo deploys automatically to GitHub Pages on every push to `main`
(see `.github/workflows/deploy.yml`).

One-time setup: in the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

The live site will be at `https://ESHANPT.github.io/Personal-Dashboard/`.

How it works: Lovable builds this app for a server (Cloudflare). GitHub Pages only serves static files,
so the workflow sets `GITHUB_PAGES=true`, which makes `vite.config.ts` produce a static single-page app
with the `/Personal-Dashboard/` base path. Normal Lovable / local development is unaffected.
If you ever rename the repository, update `BASE` in `vite.config.ts` to match.
