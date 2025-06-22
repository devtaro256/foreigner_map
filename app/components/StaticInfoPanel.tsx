import React from 'react';
import { PopulationData, JinshuType } from '@/types';
import { parsePopulationNumber, formatPopulation } from '@/lib/csvLoader';

interface StaticInfoPanelProps {
  data: PopulationData[];
  selectedJinshu?: JinshuType;
  className?: string;
}

// サーバーサイドで事前計算された統計情報を表示するコンポーネント
export default function StaticInfoPanel({ 
  data, 
  selectedJinshu = '中国',
  className = "" 
}: StaticInfoPanelProps) {
  // 総人口を計算
  const totalPopulation = React.useMemo(() => {
    if (!data.length) return 0;
    
    return data.reduce((total, row) => {
      const population = parsePopulationNumber(row[selectedJinshu]);
      return total + population;
    }, 0);
  }, [data, selectedJinshu]);

  // トップ3の区を計算
  const topDistricts = React.useMemo(() => {
    if (!data.length) return [];
    
    const districts = data.map((row) => ({
      name: row['国・地域(人)'],
      population: parsePopulationNumber(row[selectedJinshu])
    })).sort((a, b) => b.population - a.population);
    
    return districts.slice(0, 3);
  }, [data, selectedJinshu]);

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="p-6">
        {/* 統計情報（SSRで配信） */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedJinshu}系住民統計（東京都23区）
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                総人口
              </h4>
              <p className="text-2xl font-bold text-blue-900">
                {formatPopulation(totalPopulation)}人
              </p>
            </div>
            
            {topDistricts.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">
                  最多人口区
                </h4>
                <p className="text-lg font-semibold text-green-900">
                  {topDistricts[0].name}
                </p>
                <p className="text-sm text-green-700">
                  {formatPopulation(topDistricts[0].population)}人
                </p>
              </div>
            )}
            
            {data.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  対象区数
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {data.length}区
                </p>
              </div>
            )}
          </div>
        </div>

        {/* トップ3ランキング（SSRで配信） */}
        {topDistricts.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              {selectedJinshu}系住民数ランキング
            </h4>
            <div className="space-y-2">
              {topDistricts.map((district, index) => (
                <div 
                  key={district.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3
                      ${index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-400 text-white' : 
                        'bg-orange-400 text-white'}
                    `}>
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">
                      {district.name}
                    </span>
                  </div>
                  <span className="text-gray-700 font-semibold">
                    {formatPopulation(district.population)}人
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 