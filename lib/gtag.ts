// Google Analytics 4 の設定
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// ページビューをトラッキング
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// カスタムイベントをトラッキング
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 国籍選択のトラッキング専用関数
export const trackNationalitySelection = (nationality: string) => {
  event({
    action: 'select_nationality',
    category: 'user_interaction',
    label: nationality,
  });
};

// 地図マーカークリックのトラッキング
export const trackMarkerClick = (kuName: string, nationality: string) => {
  event({
    action: 'click_marker',
    category: 'map_interaction',
    label: `${kuName}_${nationality}`,
  });
};