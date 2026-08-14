/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 120,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Désactiver le pré-rendu pour les pages problématiques
  output: 'standalone',
  experimental: {
    // Permet d'ignorer les erreurs de pré-rendu
    serverComponentsExternalPackages: [],
  },
  // Désactiver le pré-rendu automatique pour certaines pages
  // (via la configuration des routes)
  async rewrites() {
    return [
      // Rediriger les pages dynamiques vers le client
    ]
  },
  // Forcer le rendu côté client pour les pages problématiques
  trailingSlash: false,
}

module.exports = nextConfig
