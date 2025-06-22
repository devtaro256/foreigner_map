import Papa from 'papaparse';
import { PopulationData } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * サーバーサイドでCSVファイルを読み込んで解析する
 * @returns Promise<PopulationData[]> 解析されたデータ
 */
export async function loadCsvDataServer(): Promise<PopulationData[]> {
  try {
    // サーバーサイドでファイルシステムから読み込み
    const filePath = path.join(process.cwd(), 'public', 'data', 'tokyo_foreign_population.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    return new Promise((resolve, reject) => {
      Papa.parse(fileContent, {
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
    console.error('サーバーサイドCSVデータの読み込みエラー:', error);
    throw error;
  }
} 