'use client';

import React from 'react';
import { JinshuType } from '@/types';
import { JINSHU_LIST } from '@/lib/mapUtils';

interface DataSelectorProps {
  selectedJinshu: JinshuType;
  onJinshuChange: (jinshu: JinshuType) => void;
  className?: string;
}

export default function DataSelector({ 
  selectedJinshu, 
  onJinshuChange, 
  className = "" 
}: DataSelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onJinshuChange(event.target.value as JinshuType);
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <label 
            htmlFor="jinshu-select" 
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            表示する国籍・地域を選択
          </label>
          <select
            id="jinshu-select"
            value={selectedJinshu}
            onChange={handleChange}
            className="custom-select max-w-xs"
            aria-describedby="jinshu-description"
          >
            {JINSHU_LIST.map((jinshu) => (
              <option key={jinshu} value={jinshu}>
                {jinshu}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          <p id="jinshu-description">
            選択した国籍・地域の人口分布が地図上に表示されます
          </p>
        </div>
      </div>
    </div>
  );
} 