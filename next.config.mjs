/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Three.js / R3F ship modern ESM — let Next transpile them (avoids broken dev chunks).
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Security headers: skip in dev so HMR + `/_next/static` are never tangled with strict CSP/nosniff diagnostics.
  // Production keeps full hardening.
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com data:",
              "connect-src 'self' https: wss: ws:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Webpack: handle 0G SDK and ethers polyfills
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // Silence optional peer-dep warnings from MetaMask SDK + WalletConnect
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
