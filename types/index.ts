export type PopulationData={[key:string]:string}

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