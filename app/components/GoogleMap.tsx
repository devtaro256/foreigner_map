'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { PopulationData, SelectedInfo, JinshuType } from '@/types';
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
  const [selectedJinshu, setSelectedJinshu] = useState<JinshuType>('中国');
  const [loading, setLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(11);

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
  const handleJinshuChange = useCallback((jinshu: JinshuType) => {
    setSelectedJinshu(jinshu);
    setSelectedInfo(null); // 選択をリセット
  }, []);

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
      />

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