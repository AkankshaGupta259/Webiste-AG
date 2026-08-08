import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Whitelist the hosts that serve personal-side images so next/image
    // can optimize them in production. Cloudinary is the active provider;
    // the Supabase host is included in case STORAGE_PROVIDER=supabase.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
