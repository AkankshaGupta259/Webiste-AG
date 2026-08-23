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
  // Allow the dev server to serve HMR assets to devices on the local network.
  // This is needed when testing from a phone via http://<your-PC-IP>:3000.
  allowedDevOrigins: ["192.168.0.*", "127.0.0.1", "10.64.137.92"],
};

export default nextConfig;
