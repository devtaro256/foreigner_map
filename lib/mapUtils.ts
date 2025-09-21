import { LatLng, KuLatLngMapping, MarkerStyle,  } from '@/types';

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
  let color = '#87CEEB'; // パステルスカイブルー
  let diameter = 32;

  if (population >= 15000) {
    color = '#FFB6C1'; // パステルピンク（ライトピンク）
    diameter = 56;
  } else if (population >= 10000) {
    color = '#FFD700'; // パステルゴールド（ライトゴールド）
    diameter = 48;
  } else if (population >= 5000) {
    color = '#98FB98'; // パステルグリーン（ライトグリーン）
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
  
  // パステルカラーに合わせて境界線の色も調整
  const strokeColor = color === '#FFB6C1' ? '#FF69B4' : // パステルピンクの境界線
                      color === '#FFD700' ? '#DAA520' : // パステルゴールドの境界線
                      color === '#98FB98' ? '#32CD32' : // パステルグリーンの境界線
                      '#4682B4'; // パステルスカイブルーの境界線
  
  // 直径に応じて境界線の太さを調整
  const strokeWidth = diameter >= 50 ? 3 : diameter >= 40 ? 2.5 : 2;
  const radius = diameter / 2 - strokeWidth;
  
  // より詳細なSVGアイコンを生成（ドロップシャドウ効果付き）
  const svgContent = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}'>
      <defs>
        <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='1' dy='1' stdDeviation='1' flood-color='rgba(0,0,0,0.2)'/>
        </filter>
      </defs>
      <circle 
        cx='${diameter/2}' 
        cy='${diameter/2}' 
        r='${radius}' 
        fill='${color}' 
        stroke='${strokeColor}' 
        stroke-width='${strokeWidth}'
        filter='url(#shadow)'
        opacity='0.9'
      />
    </svg>
  `;
  
  return {
    url: `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`,
    scaledSize: new window.google.maps.Size(diameter, diameter)
  };
}

/**
 * 人口数をフォーマット（カンマ区切り）
 * @param population 人口数
 * @returns フォーマットされた人口数文字列
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString();
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