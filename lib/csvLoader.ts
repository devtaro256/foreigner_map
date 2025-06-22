import Papa from 'papaparse';
import { PopulationData } from '@/types';

/**
 * CSVファイルを読み込んで解析する（ブラウザ用）
 * @param csvPath CSVファイルのパス
 * @returns Promise<PopulationData[]> 解析されたデータ
 */
export async function loadCsvData(csvPath: string): Promise<PopulationData[]> {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`CSVファイルの読み込みに失敗しました: ${response.status}`);
    }
    
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<PopulationData>) => {
          if (results.errors.length > 0) {
            console.warn('CSV解析中に警告:', results.errors);
          }
          
          // 地域階層=4 かつ 区名が「区」で終わるものだけ抽出
          const filtered = results.data.filter(
            (row) => 
              row['地域階層'] === '4' && 
              typeof row['国・地域(人)'] === 'string' && 
              row['国・地域(人)'].endsWith('区')
          );
          
          resolve(filtered);
        },
        error: (error: Error) => {
          reject(new Error(`CSV解析エラー: ${error.message}`));
        },
      });
    });
  } catch (error) {
    console.error('CSVデータの読み込みエラー:', error);
    throw error;
  }
}

/**
 * 数値文字列をパースして数値に変換
 * @param value カンマ区切りの数値文字列
 * @returns 数値
 */
export function parsePopulationNumber(value: string | undefined): number {
  if (!value) return 0;
  const cleanValue = String(value).replace(/,/g, '');
  const num = Number(cleanValue);
  return isNaN(num) ? 0 : num;
}

/**
 * 人口数に基づいてフォーマットされた文字列を返す
 * @param population 人口数
 * @returns フォーマットされた文字列
 */
export function formatPopulation(population: number): string {
  return population.toLocaleString('ja-JP');
} 