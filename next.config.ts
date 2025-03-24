/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", "")
          : "rjzmzrvxyndfyylrzbdd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
