import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 빌드 시 TypeScript 타입 에러를 무시합니다.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        pathname: "/a44c26f9-8817-4e38-ad8a-1576705ab97e/**",
      },
    ],
  },
};

export default nextConfig;
