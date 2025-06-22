'use client';

import React from 'react';
import { PopulationData, SelectedInfo, JinshuType } from '@/types';
import { formatPopulation, parsePopulationNumber } from '@/lib/csvLoader';

interface InfoPanelProps {
  selectedInfo: SelectedInfo | null;
  selectedJinshu: JinshuType;
  data: PopulationData[];
  className?: string;
}

export default function InfoPanel({ 
  selectedInfo, 
  selectedJinshu, 
  data, 
  className = "" 
}: InfoPanelProps) {
  // 選択されている国籍の総人口を計算
  const totalPopulation = React.useMemo(() => {
    if (!data.length) return 0;
    
    return data.reduce((total, row) => {
      const population = parsePopulationNumber(row[selectedJinshu]);
      return total + population;
    }, 0);
  }, [data, selectedJinshu]);

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="p-6">
        {/* 選択されたマーカーの詳細情報 */}
        {selectedInfo ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {selectedInfo.row['国・地域(人)']}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {selectedJinshu}人口
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatPopulation(
                    parsePopulationNumber(selectedInfo.row[selectedJinshu])
                  )}人
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  外国人総人口
                </p>
                <p className="text-lg font-semibold text-blue-900">
                  {formatPopulation(
                    parsePopulationNumber(selectedInfo.row.総数)
                  )}人
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-center">
              地図上のマーカーをクリックして詳細情報を表示
            </p>
          </div>
        )}

        {/* 統計情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              23区合計（{selectedJinshu}）
            </h4>
            <p className="text-2xl font-bold text-gray-900">
              {formatPopulation(totalPopulation)}人
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 