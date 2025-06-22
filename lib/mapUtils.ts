import { LatLng, KuLatLngMapping, MarkerStyle, JinshuType } from '@/types';

// 区名→緯度経度マッピング
export const kuLatLng: KuLatLngMapping = {
  "千代田区": { lat: 35.6938, lng: 139.7530 },
  "中央区": { lat: 35.6702, lng: 139.7727 },
  "港区": { lat: 35.6581, lng: 139.7516 },
  "新宿区": { lat: 35.6938, lng: 139.7034 },
  "文京区": { lat: 35.7081, lng: 139.7528 },
  "台東区": { lat: 35.7128, lng: 139.7802 },
  "墨田区": { lat: 35.7101, lng: 139.8016 },
  "江東区": { lat: 35.6735, lng: 139.8175 },
  "品川区": { lat: 35.6092, lng: 139.7300 },
  "目黒区": { lat: 35.6411, lng: 139.6982 },
  "大田区": { lat: 35.5614, lng: 139.7161 },
  "世田谷区": { lat: 35.6467, lng: 139.6539 },
  "渋谷区": { lat: 35.6618, lng: 139.7041 },
  "中野区": { lat: 35.7074, lng: 139.6636 },
  "杉並区": { lat: 35.6998, lng: 139.6368 },
  "豊島区": { lat: 35.7289, lng: 139.7101 },
  "北区": { lat: 35.7528, lng: 139.7336 },
  "荒川区": { lat: 35.7333, lng: 139.7832 },
  "板橋区": { lat: 35.7516, lng: 139.7090 },
  "練馬区": { lat: 35.7356, lng: 139.6517 },
  "足立区": { lat: 35.7750, lng: 139.8044 },
  "葛飾区": { lat: 35.7434, lng: 139.8477 },
  "江戸川区": { lat: 35.7064, lng: 139.8680 },
};

// 対応する国・地域リスト
export const JINSHU_LIST: JinshuType[] = [
  '中国', '韓国', 'ベトナム', 'ネパール', 'フィリピン', 
  'ミャンマー', '台湾', '米国', 'インド', 'インドネシア', 'その他'
];

// 東京の中心座標
export const TOKYO_CENTER: LatLng = { 
  lat: 35.6895, 
  lng: 139.6917 
};

/**
 * 人口数に基づいてマーカーのスタイルを決定
 * @param population 人口数
 * @returns MarkerStyle
 */
export function getMarkerStyle(population: number): MarkerStyle {
  let color = 'skyblue';
  let diameter = 32;

  if (population >= 15000) {
    color = 'red';
    diameter = 56;
  } else if (population >= 10000) {
    color = 'orange';
    diameter = 48;
  } else if (population >= 5000) {
    color = 'yellow';
    diameter = 40;
  }

  const fontSize = Math.max(14, Math.floor(diameter * 0.45)) * 0.5;

  return { color, diameter, fontSize };
}

/**
 * SVGマーカーアイコンを生成
 * @param style マーカーのスタイル
 * @returns Google Maps用のアイコンオブジェクト
 */
export function createMarkerIcon(style: MarkerStyle): google.maps.Icon {
  const { color, diameter } = style;
  
  return {
    url: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${diameter}' height='${diameter}'><circle cx='${diameter/2}' cy='${diameter/2}' r='${diameter/2-4}' fill='${color}' stroke='black' stroke-width='2'/></svg>`,
    scaledSize: new window.google.maps.Size(diameter, diameter)
  };
}

/**
 * 指定された区の座標を取得
 * @param kuName 区名
 * @returns LatLng | null
 */
export function getKuLatLng(kuName: string): LatLng | null {
  return kuLatLng[kuName] || null;
}

/**
 * 地図のズームレベルを計算（レスポンシブ対応）
 * @param screenWidth 画面幅
 * @returns ズームレベル
 */
export function calculateZoomLevel(screenWidth: number): number {
  if (screenWidth < 768) return 10; // モバイル
  if (screenWidth < 1024) return 11; // タブレット
  return 12; // デスクトップ
} 