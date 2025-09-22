import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /*
   * For deployment on GitHub Pages, we need to export the site to static files.
   * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: 'export',

  /*
   * If you are deploying to a subdirectory (e.g., https://<user>.github.io/<repo>/),
   * you need to uncomment and set the `basePath` and `assetPrefix`.
   * Replace `<repo>` with your repository name.
   */
  // basePath: '/<repo>',
  // assetPrefix: '/<repo>/',

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
    ],
  },
};

export default nextConfig;
