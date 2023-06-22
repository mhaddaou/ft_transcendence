/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {nextConfig,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sm.ign.com',
        port: '',
        pathname: '/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg',
      },
    ],
}
}
