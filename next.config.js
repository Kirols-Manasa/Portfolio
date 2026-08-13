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

    // منع الـ glob من scan خارج المشروع
    webpackConfig.snapshot = {
      ...(webpackConfig.snapshot || {}),
      managedPaths: [],
    };

    return webpackConfig;
  },
};

export default config;