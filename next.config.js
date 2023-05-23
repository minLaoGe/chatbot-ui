const { i18n } = require('./next-i18next.config');
function getBasePath() {
  return '/huang/cchina'
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  reactStrictMode: true,
  basePath: getBasePath(),
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = nextConfig;
