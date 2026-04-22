import type { NextConfig } from "next";
import withPWA from "next-pwa";

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'replicate.delivery' },
      { hostname: 'pbxt.replicate.delivery' },
      { hostname: '*.supabase.co' },
      { hostname: 'img.clerk.com' },
      { hostname: 'vetu.ai' },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  }
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

export default pwaConfig(baseConfig);
