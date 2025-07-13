import type { Metadata } from 'next';
import './globals.css';
import { generateStructuredData } from '@/lib/metadata';


export const metadata: Metadata = {
  metadataBase: new URL('https://foreign-population-map.vercel.app'),
  title: '東京都外国人人口マップ | 区別・国籍別データ可視化',
  description: '東京都23区の外国人人口を国籍別に地図上で可視化。最新の統計データに基づく人口分布を直感的に確認できます。',
  keywords: ['東京都', '外国人人口', '人口統計', '地図', '可視化', '23区', '国籍別', 'データ分析'],
  authors: [{ name: 'Foreign Population Map Team' }],
  creator: 'Foreign Population Map',
  publisher: 'Foreign Population Map',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: '東京都外国人人口マップ | 区別・国籍別データ可視化',
    description: '東京都23区の外国人人口を国籍別に地図上で可視化。最新の統計データに基づく人口分布を直感的に確認できます。',
    url: 'https://foreign-population-map.vercel.app',
    siteName: '東京都外国人人口マップ',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '東京都外国人人口マップのプレビュー画像',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '東京都外国人人口マップ | 区別・国籍別データ可視化',
    description: '東京都23区の外国人人口を国籍別に地図上で可視化。',
    images: ['/og-image.png'],
    creator: '@foreign_pop_map',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateStructuredData();

  return (
    <html lang="ja" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`h-full bg-white text-gray-900 antialiased`}>
        <div className="min-h-full">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  東京都外国人人口マップ
                </h1>
                <div className="text-sm text-gray-600">
                  区別・国籍別データ可視化
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-gray-600">
                <p>
                  © 2024 Foreign Population Map. データ出典: 東京都統計
                </p>
                <p className="mt-1">
                  このアプリケーションは東京都の公開統計データを基に作成されています。
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 