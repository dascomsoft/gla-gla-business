/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Désactiver l'optimisation pour éviter les timeouts
    unoptimized: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
  swcMinify: true,
  // Augmenter le timeout
  staticPageGenerationTimeout: 120,
  // Ignorer les erreurs de build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
