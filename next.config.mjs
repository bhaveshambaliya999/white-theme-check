/** @type {import('next').NextConfig} */
// import withBundleAnalyzer from "@next/bundle-analyzer";

const imageDomains = [
  'rpdiamondsandjewellery-staging.s3.ap-southeast-1.amazonaws.com',
  'rpdiamondsandjewellery-uat.s3.ap-southeast-1.amazonaws.com',
  'rpdiamondsandjewellery.s3.ap-southeast-1.amazonaws.com',
  'nivoda-images.s3.eu-west-2.amazonaws.com',
  'api.qrserver.com',
  'nivoda-images.s3.amazonaws.com',
  'uq-datastorage.s3.ap-southeast-1.amazonaws.com',
  'nivoda-images.nivodaapi.net',
  'data1.360view.link',
  'uq-datastorage-uat.s3.ap-southeast-1.amazonaws.com',
  'essentialnaturaloils.com',
  'api-uat.artisanalparfumhouse.com',
  'api.artisanalparfumhouse.com',
  'sharepoint.suranabrothers.com',
  'cdn.pixabay.com',
  'uat-demo.upqor.com',
  'essentialnaturaloils.com',
  'www.essentialnaturaloils.com'
];

// Convert domains to remotePatterns
const remotePatterns = imageDomains.map((domain) => ({
  protocol: 'https',
  hostname: domain.replace(/:\d+$/, ''),
}));

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns,
    deviceSizes: [320, 640, 960, 1200, 1600, 1920],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== "ReactFreshWebpackPlugin"
      );
    }
    return config;
  },
  // experimental: {
  //   ppr: true
  // },
  async headers() {
    return [
      {
        source: "/(.*).(js|css|woff2|png|jpg|jpeg|svg|webp)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  turbopack: {},
  sassOptions: {
    quietDeps: true,
  },
  allowedDevOrigins: [
    // "https://uat-direct.upqor.com",
    "https://zurahjewellery.com",
    // "https://uat.zurahjewellery.com",
    // "https://phpstack-1028231-5794626.cloudwaysapps.com",
  ],
};

// Optional: enable bundle analyzer
// const withAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default nextConfig
// export default withAnalyzer(nextConfig);
