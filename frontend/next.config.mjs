/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/news/:path*", destination: "http://localhost:4000/api/news/:path*" },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },          // placeholder stabil
      // (opsional) kalau nanti pakai thumbnail asli sumber berita:
      { protocol: "https", hostname: "cdn.cnbcindonesia.com" },
      { protocol: "https", hostname: "img.katadata.co.id" },
      { protocol: "https", hostname: "asset.kompas.com" },
      { protocol: "https", hostname: "akcdn.detik.net.id" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
