/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable TypeScript handling. Set to true to ignore errors while building.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Future customizations:
  // images: {
  //   domains: ['example.com'],
  // },
  // basePath: '/your-base-path',
};

export default nextConfig;
