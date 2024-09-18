const nextBundleAnalyzer = require('@next/bundle-analyzer');
const path = require('path');

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

const injectRule = rule => {
  if (rule?.use?.loader !== 'next-swc-loader') {
    return;
  }
};

const NEXT_PUBLIC_API_URL = 'https://ymex-swap.83uvgv.com';
const NEXT_PUBLIC_BASE_URL = 'https://ymex-swap.83uvgv.com';
const nextConfig = {

  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  env: {
    NEXT_PUBLIC_API_URL: NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BASE_URL : NEXT_PUBLIC_BASE_URL
  },
  images: {
      remotePatterns: [
        {
          hostname: "**",
        },
      ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: "/swap/:path*",
        destination: `${NEXT_PUBLIC_API_URL}/swap/:path*`,
      },
    ];
  },
  reactStrictMode: true,
  transpilePackages: ["antd-mobile"],
  pageExtensions: ['page.tsx', 'page.ts', 'api.tsx', 'api.ts'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
     
    //console.dir(config.module.rules, { depth: null });
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

module.exports = withBundleAnalyzer(nextConfig);
