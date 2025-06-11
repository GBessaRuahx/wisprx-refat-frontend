import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // 🔍 Indicadores visuais no modo dev
  devIndicators: {
    position: 'bottom-right',
  },

  // 🔁 Redirecionamentos e Reescritas (exemplo base, pode editar depois)
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },

  // 🔐 Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  experimental: {
    serverActions: {}, // habilita recursos do App Router mais avançados
  },

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Storybook e outros builds customizados podem usar esse diretório
  output: 'standalone',

};

export default nextConfig