import { Suspense } from 'react';
import GoogleMapComponent from './components/GoogleMap';
import LoadingSpinner from './components/LoadingSpinner';
import { Metadata } from 'next';
import { loadCsvDataServer } from '@/lib/serverCsvLoader';
import { PopulationData } from '@/types';

// ページレベルでのメタデータ生成（SSR）
export const metadata: Metadata = {
  title: '東京都外国人人口マップ | 区別・国籍別データ可視化',
  description: '東京都23区の外国人人口を国籍別に地図上で可視化。最新の統計データに基づく人口分布を直感的に確認できます。',
  keywords: ['東京都', '外国人人口', '人口統計', '地図', '可視化', '23区', '国籍別', 'データ分析'],
  openGraph: {
    title: '東京都外国人人口マップ | 区別・国籍別データ可視化',
    description: '東京都23区の外国人人口を国籍別に地図上で可視化。最新の統計データに基づく人口分布を直感的に確認できます。',
    type: 'website',
    locale: 'ja_JP',
  },
};

// サーバーコンポーネントとして実装（SSR）
export default async function HomePage() {
  // サーバーサイドでデータを事前読み込み
  let populationData: PopulationData[];
  try {
    populationData = await loadCsvDataServer();
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    populationData = [];
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <a href="https://px.a8.net/svt/ejp?a8mat=45E4HX+FZ4R5E+7QW+1ZISWH" rel="nofollow" style={{ marginTop: '450px' }}>
        <img width="120" height="600" alt="" src="https://www28.a8.net/svt/bgt?aid=250921797966&wid=001&eno=01&mid=s00000001004012013000&mc=1" />
      </a>
      <img width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=45E4HX+FZ4R5E+7QW+1ZISWH" alt="" />
      <div>
        {/* アクセシビリティ用のスキップリンク */}
        <a href="#main-content" className="skip-link">
          メインコンテンツにスキップ
        </a>

        <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ページ説明（SSRで配信される静的コンテンツ） */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                このマップについて
              </h2>
              <p className="text-gray-700 text-responsive">
                東京都23区の外国人人口を国籍別に可視化したインタラクティブマップです。
                各区のマーカーは人口数に応じて色とサイズが変化し、詳細情報はマーカーをクリックして確認できます。
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2" />
                  <span>15,000人以上</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                  <span>10,000-14,999人</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                  <span>5,000-9,999人</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mr-2" />
                  <span>5,000人未満</span>
                </div>
              </div>
            </div>
          </div>

          {/* 地図コンポーネント（クライアントコンポーネント） */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <Suspense fallback={<LoadingSpinner />}>
              <GoogleMapComponent initialData={populationData} />
            </Suspense>
          </div>

          {/* データソース情報（SSRで配信される静的コンテンツ） */}
          <div className="mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                データソース
              </h3>
              <p className="text-sm text-blue-800">
                東京都統計（令和7年4月1日現在）- 区市町村別国籍・地域別外国人人口
              </p>
              <p className="text-xs text-blue-700 mt-1">
                最終更新: 令和7年4月1日 | 対象区域: 東京都23区 | データ件数: {populationData.length}区
              </p>
            </div>
          </div>
        </div>
      </div>
      <a href="https://px.a8.net/svt/ejp?a8mat=45E4HX+FZ4R5E+7QW+1ZISWH" rel="nofollow" style={{ marginTop: '450px' }}>
        <img width="120" height="600" alt="" src="https://www28.a8.net/svt/bgt?aid=250921797966&wid=001&eno=01&mid=s00000001004012013000&mc=1" />
      </a>
      <img width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=45E4HX+FZ4R5E+7QW+1ZISWH" alt="" />
    </div>
  );
} 