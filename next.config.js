const nextBundleAnalyzer = require('@next/bundle-analyzer');
const withPWA =
  process.env.NODE_ENV === 'production'
    ? require('next-pwa')({
        dest: 'public',
        register: true,
        skipWaiting: true
      })
    : config => config;

const path = require('path');

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

const injectRule = rule => {
  if (rule?.use?.loader !== 'next-swc-loader') {
    return;
  }
};

const NEXT_PUBLIC_API_URL = 'https://uat-web-cn.uvagyt.com';
const NEXT_PUBLIC_BASE_URL = 'https://uat-web-cn.uvagyt.com';
const NEXT_PUBLIC_CMC_URL = 'https://uat-web-cn.uvagyt.com';
const NEXT_PUBLIC_APP_NAME = 'Y-MEX';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    NEXT_PUBLIC_API_URL: NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BASE_URL: NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_APP_NAME: NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_CMC_URL: NEXT_PUBLIC_CMC_URL,
    NEXT_PUBLIC_LITE_ENABLE: 'true',
    NEXT_PUBLIC_PHONE_ENABLE: 'true',
    NEXT_PUBLIC_FORCE_DESKTOP_MODE: 'false',
    NEXT_PUBLIC_NEW_MARGIN_MODE: 'true',
    NEXT_PUBLIC_MOBILE_LITE_ENABLE: 'false',
  },
  images: {
    remotePatterns: [
      {
        hostname: '**'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${NEXT_PUBLIC_API_URL}/api/:path*`
      },
      {
        source: '/swap/:path*',
        destination: `${NEXT_PUBLIC_API_URL}/swap/:path*`
      }
    ];
  },
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  pageExtensions: ['page.tsx', 'page.ts', 'api.tsx', 'api.ts'],
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimize = true;
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false
      };
    }
    for (const rule of config.module.rules) {
      if (rule.oneOf) {
        for (const subRule of rule.oneOf) {
          injectRule(subRule);
        }
      } else {
        injectRule(rule);
      }
    }
    return config;
  }
};

module.exports = withPWA(withBundleAnalyzer(nextConfig));
