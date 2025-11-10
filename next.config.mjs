/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stylish-success-f82a3771a1.strapiapp.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
