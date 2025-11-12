/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for reliable Vercel deployment
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Ensure proper handling of TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
}

module.exports = nextConfig