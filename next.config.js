/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/events",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
