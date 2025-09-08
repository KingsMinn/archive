import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
