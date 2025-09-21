'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { PopulationData, SelectedInfo } from '@/types';
import { 
  kuLatLng, 
  TOKYO_CENTER, 
  getMarkerStyle, 
  createMarkerIcon,
  calculateZoomLevel
} from '@/lib/mapUtils';
import { loadCsvData, parsePopulationNumber, formatPopulation } from '@/lib/csvLoader';
import DataSelector from './DataSelector';
import InfoPanel from './InfoPanel';
import StaticInfoPanel from './StaticInfoPanel';
import LoadingSpinner, { MapSkeleton } from './LoadingSpinner';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const CSV_PATH = '/data/tokyo_foreign_population.csv';

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  // 境界表示機能を使用するためのMap ID（後で設定が必要）
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
};

interface GoogleMapComponentProps {
  initialData?: PopulationData[];
}

export default function GoogleMapComponent({ initialData = [] }: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  const [data, setData] = useState<PopulationData[]>(initialData);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo | null>(null);
  const [selectedJinshu, setSelectedJinshu] = useState<string>('中国');
  const [loading, setLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(11);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const jinshuList: string[] = data.length > 0 ? 
    Object.keys(data[0]).filter(v => 
      !["国・地域(人)","地域コード", "地域階層" ,"女","男"].includes(v)
    ) : [];

  console.log(data)

  // 画面サイズに応じたズームレベルの調整
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setZoomLevel(calculateZoomLevel(screenWidth));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CSVデータの読み込み（initialDataがない場合のみ）
  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const csvData = await loadCsvData(CSV_PATH);
        setData(csvData);
      } catch (err) {
        console.error('データ読み込みエラー:', err);
        setError('データの読み込みに失敗しました。しばらく後でお試しください。');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initialData]);

  // マーカークリック時の処理
  const handleMarkerClick = useCallback((row: PopulationData) => {
    const kuName = row['国・地域(人)'];
    const latlng = kuLatLng[kuName];
    
    if (latlng) {
      setSelectedInfo({ row, latlng });
    }
  }, []);

  // 情報ウィンドウを閉じる処理
  const handleInfoWindowClose = useCallback(() => {
    setSelectedInfo(null);
  }, []);

  // 国籍変更時の処理
  const handleJinshuChange = useCallback((jinshu: string) => {
    setSelectedJinshu(jinshu);
    setSelectedInfo(null); // 選択をリセット
  }, []);

  // 地図の初期化と境界表示の設定
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // 境界表示機能の設定
    if (showBoundaries) {
      try {
        // LOCALITY feature layerを取得（市区町村レベル）
        const featureLayer = mapInstance.getFeatureLayer(
          google.maps.FeatureType.LOCALITY
        );
        
        // 境界のスタイルを設定
        featureLayer.style = (featureStyleFunctionOptions) => {
          const placeFeature = featureStyleFunctionOptions.feature;
          
          // 東京の区の境界を強調表示
          return {
            strokeColor: '#FF6B6B',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF6B6B',
            fillOpacity: 0.1,
          };
        };
      } catch (error) {
        console.warn('境界表示機能の設定に失敗しました:', error);
        console.warn('Map IDが正しく設定されているか確認してください');
      }
    }
  }, [showBoundaries]);

  // 境界表示の切り替え
  const toggleBoundaries = useCallback(() => {
    setShowBoundaries(prev => !prev);
  }, []);

  // 境界表示の設定を更新
  useEffect(() => {
    if (map && isLoaded) {
      try {
        const featureLayer = map.getFeatureLayer(
          google.maps.FeatureType.LOCALITY
        );
        
        if (showBoundaries) {
          // 境界のスタイルを設定
          featureLayer.style = (featureStyleFunctionOptions) => {
            return {
              strokeColor: '#FF6B6B',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF6B6B',
              fillOpacity: 0.1,
            };
          };
        } else {
          // 境界表示を無効化
          featureLayer.style = null;
        }
      } catch (error) {
        console.warn('境界表示機能の更新に失敗しました:', error);
      }
    }
  }, [map, isLoaded, showBoundaries]);

  // ローディング状態
  if (loading) {
    return <LoadingSpinner message="データを読み込み中..." />;
  }

  // エラー状態
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            エラーが発生しました
          </h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // Google Maps APIのローディングエラー
  if (loadError) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            地図の読み込みに失敗しました
          </h3>
          <p className="text-red-700">
            Google Maps APIの読み込み中にエラーが発生しました。
          </p>
        </div>
      </div>
    );
  }

  // Google Maps APIの読み込み中
  if (!isLoaded) {
    return <MapSkeleton />;
  }

  return (
    <div className="w-full">
      {/* データ選択セクション */}
      <DataSelector
        selectedJinshu={selectedJinshu}
        onJinshuChange={handleJinshuChange}
        jinshuList={jinshuList}
      />

      {/* 境界表示切り替えボタン */}
      <div className="mb-4 flex justify-center">
        <button
          onClick={toggleBoundaries}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showBoundaries
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {showBoundaries ? '境界表示: ON' : '境界表示: OFF'}
        </button>
      </div>

      {/* 統計情報パネル */}
      {data.length > 0 && (
        <div className="mb-6">
          <StaticInfoPanel 
            data={data} 
            selectedJinshu={selectedJinshu}
          />
        </div>
      )}

      {/* 地図セクション */}
      <div className="p-6 pt-0">
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={TOKYO_CENTER}
            zoom={zoomLevel}
            options={mapOptions}
            onLoad={onMapLoad}
          >
            {data.map((row, idx) => {
              const kuName = row['国・地域(人)'];
              const latlng = kuLatLng[kuName];
              
              if (!latlng) return null;

              const population = parsePopulationNumber(row[selectedJinshu]);
              const style = getMarkerStyle(population);
              const icon = createMarkerIcon(style);

              return (
                <Marker
                  key={`${kuName}-${idx}`}
                  position={latlng}
                  onClick={() => handleMarkerClick(row)}
                  label={{
                    text: formatPopulation(population),
                    color: 'black',
                    fontSize: `${style.fontSize}px`,
                    fontWeight: 'bold',
                  }}
                  icon={icon}
                  title={`${kuName}: ${formatPopulation(population)}人`}
                />
              );
            })}

            {selectedInfo && (
              <InfoWindow
                position={selectedInfo.latlng}
                onCloseClick={handleInfoWindowClose}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -40),
                }}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-lg mb-2 text-black">
                    {selectedInfo.row['国・地域(人)']}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-black">
                      <span className="font-medium">{selectedJinshu}:</span>{' '}
                      {formatPopulation(
                        parsePopulationNumber(selectedInfo.row[selectedJinshu])
                      )}人
                    </p>
                    <p className="text-black text-sm">
                      <span className="font-medium">外国人総数:</span>{' '}
                      {formatPopulation(
                        parsePopulationNumber(selectedInfo.row.総数)
                      )}人
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>

      {/* 情報パネル */}
      <InfoPanel
        selectedInfo={selectedInfo}
        selectedJinshu={selectedJinshu}
        data={data}
      />
    </div>
  );
} 