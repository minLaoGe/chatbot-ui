const { i18n } = require('./next-i18next.config');
function getBasePath() {
  return '/gpt'
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  eslint: {
    // 禁用 ESLint
    ignoreDuringBuilds: true,
  },
  basePath: getBasePath(),
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
