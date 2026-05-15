import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Suppress Windows case-insensitive filesystem duplicate module warnings
    config.infrastructureLogging = { level: 'error' }
    return config
  },
}

export default withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig)
