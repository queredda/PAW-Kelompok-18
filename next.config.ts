import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*'
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
      },
      {
        source: '/:path*',
        destination: '/'
      }
    ];
  },
  images: {
    domains: ['drive.google.com'],
  },
};

export default nextConfig;
