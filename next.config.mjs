// GitHub Pages configuration
// If deploying to a project page (username.github.io/repository-name), set basePath
// If deploying to user/organization page (username.github.io), leave basePath empty
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isProjectPage = isGithubPages && repositoryName && !repositoryName.includes('.github.io');

const nextConfig = {
  /* config options here */
  output: 'export', // Enable static export for GitHub Pages
  trailingSlash: true, // Add trailing slashes to URLs for GitHub Pages compatibility
  basePath: isProjectPage ? `/${repositoryName}` : '',
  assetPrefix: isProjectPage ? `/${repositoryName}` : '',
  experimental: {
    inlineCss: true,
    useCache: true,
    clientSegmentCache: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zylq-002.dx.commercecloud.salesforce.com',
      },
      {
        protocol: 'https',
        hostname: 'edge.disstg.commercecloud.salesforce.com',
      },
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
};

export default nextConfig;
