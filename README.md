# 東京都外国人人口マップ

東京都23区の外国人人口を国籍別に地図上で可視化するインタラクティブアプリケーションです。

![東京都外国人人口マップ](./public/og-image.png)

## 🚀 デモ

[https://foreign-population-map.vercel.app](https://foreign-population-map.vercel.app)

## ✨ 機能

- **インタラクティブ地図**: Google Maps APIを使用した直感的な地図操作
- **国籍別表示**: 11の国・地域（中国、韓国、ベトナム、ネパール、フィリピン、ミャンマー、台湾、米国、インド、インドネシア、その他）から選択可能
- **視覚的データ表現**: 人口数に応じたマーカーサイズと色の変化
- **詳細情報表示**: マーカークリックで区別詳細データを表示
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ対応
- **SEO最適化**: メタデータ、構造化データ、サイトマップ対応
- **アクセシビリティ**: WCAG 2.1 AA準拠

## 🛠 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **地図**: Google Maps API
- **データ処理**: Papa Parse
- **デプロイ**: Vercel

## 📊 データソース

東京都統計（令和7年4月1日現在）- 区市町村別国籍・地域別外国人人口

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Google Maps API キー

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/foreign-population-map.git
cd foreign-population-map
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local`ファイルに以下を記入：
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Google Maps API キーの取得

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. Maps JavaScript API を有効化
4. APIキーを作成し、必要に応じてドメイン制限を設定

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 📦 ビルドとデプロイ

### 本番用ビルド

```bash
npm run build
npm start
```

### 静的サイト生成（SSG）

このアプリケーションはSSG（Static Site Generation）に対応しており、静的ファイルとしてデプロイ可能です：

```bash
# SSG用ビルド
npm run build

# 静的ファイルが`out`ディレクトリに生成されます
```
生成された静的ファイルをローカルでテストする場合：

```bash
# ビルド後、npxでローカルサーバーを起動
npx serve out -p 3000

# または、より高機能なserveを使用
npx http-server out -p 3000 -c-1
```

生成された`out`ディレクトリには以下が含まれます：
- `index.html` - メインページ
- `sitemap.xml` - サイトマップ
- `data/` - CSVデータファイル
- `_next/` - Next.jsのアセット

### 静的ホスティング

生成された静的ファイルは以下のサービスでホスティング可能です：
- GitHub Pages
- Netlify
- Vercel（静的モード）
- AWS S3 + CloudFront
- その他の静的ホスティングサービス

### Vercelでのデプロイ

1. [Vercel](https://vercel.com) アカウントを作成
2. GitHubリポジトリを接続
3. 環境変数`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`を設定
4. デプロイ実行

**注意**: SSGモードでは環境変数はビルド時に埋め込まれるため、公開されるAPIキーには適切な制限を設定してください。

## 🎯 パフォーマンス

このアプリケーションは以下のパフォーマンス目標を達成するよう最適化されています：

- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Lighthouse Score**: 90以上（全項目）

## 🎨 デザインシステム

### カラーパレット

- **Primary**: #646cff
- **Secondary**: #747bff
- **Success**: #10b981
- **Warning**: #f59e0b
- **Error**: #ef4444

### マーカー色分け

- 🔴 **赤色**: 15,000人以上
- 🟠 **オレンジ**: 10,000-14,999人
- 🟡 **黄色**: 5,000-9,999人
- 🔵 **水色**: 5,000人未満

## 🧪 テスト

```bash
# テスト実行
npm test

# テストカバレッジ
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

## 📝 API

### データエンドポイント

- `GET /data/tokyo_foreign_population.csv` - 東京都外国人人口データ

## ♿ アクセシビリティ

このアプリケーションは以下のアクセシビリティ機能を提供します：

- セマンティックHTML
- ARIA属性
- キーボードナビゲーション
- スクリーンリーダー対応
- 高コントラストモード対応
- 縮小運動設定対応

## 🌍 SEO対応

- **メタデータ**: 動的なタイトル・説明文
- **Open Graph**: SNS共有時の表示最適化
- **構造化データ**: JSON-LD形式
- **サイトマップ**: 自動生成
- **robots.txt**: 検索エンジン最適化

## 🤝 コントリビューション

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. コミット (`git commit -m 'Add some AmazingFeature'`)
4. プッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

### 開発ガイドライン

- TypeScriptの型安全性を保つ
- ESLintルールに従う
- コミットメッセージは日本語で明確に
- テストコードの作成
- アクセシビリティを考慮

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript)
- [東京都統計](https://www.toukei.metro.tokyo.lg.jp/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

## 📞 サポート

問題やバグを発見した場合は、[Issues](https://github.com/yourusername/foreign-population-map/issues)から報告してください。

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
