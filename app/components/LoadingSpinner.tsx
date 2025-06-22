import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

// SSR対応のローディングスピナー
export default function LoadingSpinner({ 
  message = "地図を読み込み中...", 
  className = "" 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="loading-spinner text-primary mb-4" />
      <p className="text-gray-600 text-center animate-pulse">{message}</p>
    </div>
  );
}

// SSR対応のマップスケルトン
export function MapSkeleton() {
  return (
    <div className="map-container bg-gray-100">
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="skeleton w-16 h-16 rounded-full mb-4 mx-auto" />
          <div className="skeleton w-32 h-4 mb-2 mx-auto" />
          <div className="skeleton w-24 h-3 mx-auto" />
        </div>
      </div>
    </div>
  );
} 