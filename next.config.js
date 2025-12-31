/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimize for serverless deployment
  swcMinify: true,
}

module.exports = nextConfig
