/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig = {
  ...(isStaticExport
    ? { output: "export", images: { unoptimized: true } }
    : {}),
  basePath: isStaticExport ? (process.env.NEXT_PUBLIC_BASE_PATH || "") : "",
};

export default nextConfig;
