# 資料 Schema

本網站目前唯一正式資料來源輸出路徑為：

- `assets/js/data/trips-data.js`
- `assets/js/data/trip-detail-data.js`

網站頁面與腳本都應只讀取這兩份資料；根目錄舊版 `trips-data.js`、`trip-detail-data.js` 已停用，且同步流程不再輸出 `trips/*.js`。

## 1. `TRIPS_DATA`

`TRIPS_DATA` 是陣列，每一筆代表一趟旅程摘要，主要提供首頁、旅程列表、篩選與卡片使用。

### 必要欄位

- `slug: string`
  - 穩定且唯一的旅程識別值
  - `trip.html` 一律以 `?slug=` 讀取
- `name: string`
  - 旅程名稱
- `summary: string`
  - 卡片摘要與部分頁面導言
- `regions: string[]`
  - 地區標籤，可同時存在多個值
- `countries: string[]`
  - 旅程涉及國家
- `cities: string[]`
  - 旅程涉及城市，沒有可為空陣列
- `status: string`
  - 目前使用「已發布」判斷是否公開
- `featured: boolean`
  - 是否在首頁精選區顯示

### 常用欄位

- `image: string`
  - 封面圖 URL，若 Notion 未提供則使用預設圖
- `tag: string`
  - 卡片小標籤，通常來自標籤或第一個國家
- `year: number | null`
  - 旅遊年份，可由日期推導
- `days: number | null`
  - 旅遊天數，可由開始/結束日期推導
- `start: string`
  - 開始日期，ISO 格式字串
- `end: string`
  - 結束日期，ISO 格式字串
- `href: string`
  - 目前保留欄位，前端主要仍以 `slug` 組旅程連結

## 2. `TRIP_DETAILS`

`TRIP_DETAILS` 是物件，key 為旅程 `slug`，value 為該旅程的詳細內容。

```js
TRIP_DETAILS[slug] = {
  guide: { ... },
  countries: []
}
```

### `guide`

旅程詳細頁主內容。

- `eyebrow: string`
  - 頁面上方短標
- `lead: string`
  - 開場摘要
- `toc: Array<{ id: string, title: string }>`
  - 章節目錄
- `sections: Section[]`
  - 內容區塊陣列

### `countries`

目前保留為各國補充內容陣列，供國家卡片與懶人包使用。每筆建議包含：

- `name: string`
- `journeySpots: string[]`
- `food: string`
- `moments: string`

## 3. `guide.sections` 允許的區塊型別

目前同步腳本會產出以下型別：

- `h2`
  - `{ type: 'h2', id, text }`
- `p`
  - `{ type: 'p', text }`
- `ul`
  - `{ type: 'ul', items }`
- `callout`
  - `{ type: 'callout', variant, title, body }`
- `blockquote`
  - `{ type: 'blockquote', text }`
- `faq`
  - `{ type: 'faq', items: [{ q, a }] }`
- `infoBox`
  - `{ type: 'infoBox', title, rows: [{ label, value }] }`
- `table`
  - `{ type: 'table', headers: string[], rows: string[][] }`
- `photos`
  - `{ type: 'photos', items: [{ src, caption }] }`

## 4. Notion 對應原則

目前腳本主要從 Notion 讀取以下欄位：

- 名稱
- slug
- 摘要 / lead / eyebrow
- 封面圖案 / 封面圖片
- 標籤
- 地區
- 國家
- 城市
- 年份
- 天數
- 開始日期 / 日期
- 狀態
- 是否精選

## 5. 維護規則

- `slug` 必須唯一且不可隨意更動
- 新頁面不可再讀取根目錄舊版資料檔
- 若調整欄位命名或 section 結構，需同步更新：
  - `scripts/notion_sync.py`
  - 使用 `TRIPS_DATA` / `TRIP_DETAILS` 的前端頁面
  - 驗證腳本與操作文件

## 6. 同步時的必要欄位警告

`scripts/notion_sync.py` 目前會在同步完成後輸出 warnings，方便提早發現資料不完整，但不會中斷同步。

### `TRIPS_DATA` 會檢查

- `slug`
- `name`
- `summary`
- `regions`
- `countries`

### `TRIP_DETAILS` 會檢查

- `guide.lead`
- `guide.sections`

### 額外檢查

- `slug` 不可重複
- 已發布旅程必須有對應的 `TRIP_DETAILS`
- `TRIP_DETAILS` 不可出現沒有對應 `TRIPS_DATA` 的孤兒資料
