/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  reactStrictMode: true,
  
  // Otimização de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'k6hrqrxuu8obbfwn.public.blob.vercel-storage.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compressão
  compress: true,
  
  // Experimental features para melhor performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}

module.exports = nextConfig
