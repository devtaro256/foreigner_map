'use client';

import React from 'react';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface DataSelectorProps {
  selectedJinshu: string;
  onJinshuChange: (jinshu: string) => void;
  className?: string;
  jinshuList:string[]
}

export default function DataSelector({ 
  selectedJinshu, 
  onJinshuChange, 
  className = "" ,
  jinshuList,
}: DataSelectorProps) {
  const handleChange = (value:string|null) => {
    onJinshuChange(value??"");
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
          <Autocomplete
            value={selectedJinshu}
            onChange={(_, value) => handleChange(value)}
            options={jinshuList}
            className="max-w-xs"
            aria-describedby="jinshu-description" 
            renderInput={(params) => <TextField {...params} label="国籍" />}
            />
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