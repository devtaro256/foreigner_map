/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSG (Static Site Generation) の設定
  output: 'export',
  trailingSlash: true,
  // ファイルシステムから直接開けるように相対パスを使用
  assetPrefix: './',
  // 画像最適化を無効化（SSGでは対応していないため）
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  // SSGではheadersは動作しないため削除
  // Sitemap生成
  async generateBuildId() {
    return 'foreign-population-map-' + Date.now();
  },
};

module.exports = nextConfig; 