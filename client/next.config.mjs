/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',  // ← add this
    ],
  },
};

export default nextConfig;
