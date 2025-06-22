// import { Metadata } from 'next';
export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string[];
  authors?: { name: string }[];
  creator?: string;
  publisher?: string;
  robots?: any;
  openGraph?: any;
  twitter?: any;
  viewport?: any;
  icons?: any;
  manifest?: string;
}
import { StructuredData } from '@/types';

// 基本的なメタデータ
export const defaultMetadata: Metadata = {
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

/**
 * 構造化データ（JSON-LD）を生成
 * @returns StructuredData
 */
export function generateStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '東京都外国人人口マップ',
    description: '東京都23区の外国人人口を国籍別に地図上で可視化するインタラクティブアプリケーション',
    url: 'https://foreign-population-map.vercel.app',
    applicationCategory: 'DataVisualizationApplication',
    operatingSystem: 'Web Browser',
  };
}

/**
 * 動的なページタイトルを生成
 * @param nationality 選択された国籍（オプション）
 * @returns ページタイトル
 */
export function generatePageTitle(nationality?: string): string {
  const baseTitle = '東京都外国人人口マップ | 区別・国籍別データ可視化';
  
  if (nationality) {
    return `${nationality}系人口分布 - ${baseTitle}`;
  }
  
  return baseTitle;
}

/**
 * 動的なページ説明を生成
 * @param nationality 選択された国籍（オプション）
 * @returns ページ説明
 */
export function generatePageDescription(nationality?: string): string {
  const baseDescription = '東京都23区の外国人人口を国籍別に地図上で可視化。最新の統計データに基づく人口分布を直感的に確認できます。';
  
  if (nationality) {
    return `東京都23区における${nationality}系住民の人口分布を地図上で可視化。${baseDescription}`;
  }
  
  return baseDescription;
} 