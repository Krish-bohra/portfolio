/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.shadcnspace.com",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
