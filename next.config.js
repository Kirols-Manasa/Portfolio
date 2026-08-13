 import "./src/env.js";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("next").NextConfig} */
const config = {
  images: {
    formats: ["image/avif", "image/webp"],
    // ✅ الصور المحلية في /public مش محتاجة optimization هنا
    // لأن Next.js بيتعامل معاها تلقائياً
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