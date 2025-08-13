/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/news/:path*", destination: "http://localhost:4000/api/news/:path*" },
      { source: "/api/chat", destination: "http://localhost:4000/api/chat" }, // penting
    ];
  },  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // boleh dimatikan nanti jika optimasi ingin aktif:
    // unoptimized: true,
  },
};

export default nextConfig;
