const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

import type {NextConfig} from 'next'

const isProd = process.env.NODE_ENV === 'production'

const withPWA = require('next-pwa')({
  disable: !isProd,
  skipWaiting: true,
  dest: 'public',
  include: ['**/*.css'], // すべてのCSSファイルをプリキャッシュする
  runtimeCaching: [
    {
      urlPattern: /.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'https-cache',
        expiration: {
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
})

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {bodySizeLimit: '10mb'},
  },
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: '**kickswrap.com'},
      {protocol: 'https', hostname: '**.amazonaws.com'},
      {protocol: 'https', hostname: '**drive.google.com**'},
    ],
    domains: ['*kickswrap.com*', 'drive.google.com', '*.amazonaws.com'],
  },
}

export default isProd ? withPWA(nextConfig) : nextConfig
