/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      canvas: "commonjs canvas",
    });
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
