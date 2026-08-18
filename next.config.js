  import "./src/env.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("next").NextConfig} */
const config = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1920],
    imageSizes: [20, 64, 160, 250, 384],
    minimumCacheTTL: 31536000,
    localPatterns: [
      { pathname: "/**", search: "" },
    ],
  },

  outputFileTracingRoot: __dirname,

  webpack: (webpackConfig) => {
    webpackConfig.context = __dirname;
    webpackConfig.watchOptions = {
      ...webpackConfig.watchOptions,
      ignored: [
        "**/node_modules/**",
        "**/Application Data/**",
        "**/AppData/**",
        "**/Cookies/**",
      ],
    };
    webpackConfig.snapshot = {
      ...(webpackConfig.snapshot || {}),
      managedPaths: [],
    };
    return webpackConfig;
  },
};

export default config;