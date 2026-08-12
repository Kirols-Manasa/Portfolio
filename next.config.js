 import "./src/env.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("next").NextConfig} */
const config = {
  images: {
    unoptimized: true,
  },

  // Keep Next's file tracer inside this application. This is especially
  // important when the app lives in a nested directory or has dependencies
  // hoisted above it.
  outputFileTracingRoot: __dirname,

  webpack: (webpackConfig) => {
    // Make webpack resolve relative paths from the app directory instead of
    // the shell's working directory (which can be the Windows user profile).
    webpackConfig.context = __dirname;

    // "Application Data" is a protected Windows junction to AppData. Ignore
    // it if a watcher encounters it; the glob is a no-op on Vercel/Linux.
    webpackConfig.watchOptions = {
      ...webpackConfig.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/Application Data/**",
        "**/AppData/**",
      ],
    };

    return webpackConfig;
  },
};

export default config;