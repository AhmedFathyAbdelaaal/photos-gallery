/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // We serve photos from the local filesystem via /api/photo/[filename]
    // so next/image isn't used for user photos — we use plain <img> tags
    // to guarantee zero recompression.
    unoptimized: true,
  },
  // Allow large uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig
