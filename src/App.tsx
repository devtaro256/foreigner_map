import { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import Papa from 'papaparse';
import './App.css';

const apiKey = import.meta.env.VITE_API_KEY ?? "";
const csvPath = import.meta.env.VITE_CSV_PATH ?? "";
const mapContainerStyle = { width: '100vw', height: '100vh' };
const center = { lat: 35.6895, lng: 139.6917 };

// 区名→緯度経度マッピング（主要区のみ例示、必要に応じて追加）
const kuLatLng: Record<string, { lat: number; lng: number }> = {
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

const JINSHU_LIST = [
  '中国', '韓国', 'ベトナム', 'ネパール', 'フィリピン', 'ミャンマー', '台湾', '米国', 'インド', 'インドネシア', 'その他'
];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedJinshu, setSelectedJinshu] = useState<string>('中国');

  useEffect(() => {
    fetch(csvPath)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            // 地域階層=4 かつ 区名が「区」で終わるものだけ抽出
            const filtered = (results.data as any[]).filter(
              (row) => row['地域階層'] === '4' && typeof row['国・地域(人)'] === 'string' && row['国・地域(人)'].endsWith('区')
            );
            setData(filtered);
          },
        });
      });
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 10, left: 10, top: 10, background: 'white', padding: 8, borderRadius: 8 }}>
        <label htmlFor="jinshu-select">人種（国・地域）を選択：</label>
        <select
          id="jinshu-select"
          value={selectedJinshu}
          onChange={e => setSelectedJinshu(e.target.value)}
        >
          {JINSHU_LIST.map(j => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={11}>
        {data.map((row, idx) => {
          const name = row['国・地域(人)'];
          const latlng = kuLatLng[name];
          if (!latlng) return null;
          return (
            <Marker
              key={idx}
              position={latlng}
              onClick={() => {
                const sel = { row, latlng };
                setSelected(sel);
              }}
              label={{
                text: row[selectedJinshu] ? String(row[selectedJinshu]) : '',
                color: 'black',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />
          );
        })}
        {selected && selected.latlng && selected.row && (
          <InfoWindow
            position={selected.latlng}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h3>{selected.row['国・地域(人)']}</h3>
              <p>{selectedJinshu}：{selected.row[selectedJinshu]}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
}

export default App;
