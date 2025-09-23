import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /*
   * For deployment on GitHub Pages, we need to export the site to static files.
   * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /*
   * The basePath and assetPrefix are configured automatically by the `actions/configure-pages`
   * in the GitHub Actions workflow. Do not set them here.
   * They are only needed for subdirectory deployments.
   */
  // basePath: '/portfolio',
  // assetPrefix: '/portfolio/',

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    /*
     * Static export doesn't support Next.js's default image optimization.
     * We need to disable it.
     * https://nextjs.org/docs/app/building-your-application/deploying/static-exports#nextimage
     */
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.vernato.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
