/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Vercel deployment with full Next.js features
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Environment variables for different deployment environments
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig