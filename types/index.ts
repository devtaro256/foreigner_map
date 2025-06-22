// 人口データの型定義
export interface PopulationData {
  地域階層: string;
  地域コード: string;
  '国・地域(人)': string;
  総数: string;
  中国: string;
  韓国: string;
  ベトナム: string;
  ネパール: string;
  フィリピン: string;
  ミャンマー: string;
  台湾: string;
  米国: string;
  インド: string;
  インドネシア: string;
  その他: string;
  '前年同月との比較／総数': string;
  '前年同月との比較／増減数': string;
}

// 地図の位置座標
export interface LatLng {
  lat: number;
  lng: number;
}

// 区別の緯度経度マッピング
export interface KuLatLngMapping {
  [kuName: string]: LatLng;
}

// 選択された情報
export interface SelectedInfo {
  row: PopulationData;
  latlng: LatLng;
}

// 国・地域の型
export type JinshuType = '中国' | '韓国' | 'ベトナム' | 'ネパール' | 'フィリピン' | 'ミャンマー' | '台湾' | '米国' | 'インド' | 'インドネシア' | 'その他';

// マーカーのスタイル設定
export interface MarkerStyle {
  color: string;
  diameter: number;
  fontSize: number;
}

// メタデータの型
export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// 構造化データの型
export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
} 