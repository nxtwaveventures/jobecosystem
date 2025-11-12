/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  // Only enable static export for GitHub Pages
  ...(isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'dist'
  }),
  images: {
    unoptimized: isGitHubPages
  },
  basePath: isGitHubPages ? '/hirefast' : '',
  assetPrefix: isGitHubPages ? '/hirefast' : '',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig