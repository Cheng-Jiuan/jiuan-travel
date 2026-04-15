# 網站操作 SOP

## 最短流程

**Notion 更新 → 同步 → 驗證 → 本機檢查 → git status → commit → push**

---

## 1. 進入專案

```bash
cd "/Users/candy/jiuan 旅遊網站"
```

---

## 2. 同步 Notion 資料

```bash
python3 scripts/notion_sync.py
```

成功時會看到：

```bash
Done! X trips synced.
```

### 目前網站主要讀這兩個檔案

```text
assets/js/data/trips-data.js
assets/js/data/trip-detail-data.js
```

### 唯一資料來源規則

- 正式資料來源只允許 `assets/js/data/trips-data.js`
- 正式詳細資料來源只允許 `assets/js/data/trip-detail-data.js`
- **不要再建立或使用專案根目錄的 `trips-data.js`、`trip-detail-data.js`**
- 如果看到根目錄出現這兩個檔案，視為舊檔殘留，應刪除，不可當成正式資料使用

### 補充

- 網站顯示內容請優先看 `assets/js/data/`
- 同步後正式輸出只保留 `assets/js/data/`，不再產生 `trips/*.js`
- 每篇旅程都必須有穩定的 `slug`
- `trip.html` 一律使用 `?slug=`

---

## 3. 跑資料驗證

```bash
node scripts/validate-trip-data.js
```

重點只看：

- 沒有 `Errors`
- `Warnings` 先確認是否可接受

---

## 4. 本機預覽

不要用 `file://` 直接開，請用本機 HTTP。

### 方法一

```bash
./開啟本機預覽.command
```

### 方法二

```bash
python3 -m http.server 9341
```

打開：

```text
http://127.0.0.1:9341/index.html
```

### 至少檢查

- `index.html`
- `journeys.html`
- `trip.html?slug=某個已發佈slug`

---

## 5. 看變更

```bash
git status
```

原則：**以 `git status` 顯示的檔案為準。**

常見正常變動：

```text
assets/js/data/trips-data.js
assets/js/data/trip-detail-data.js
assets/trip-images/...
```

---

## 6. 最常用上版指令

### 只有內容同步

```bash
git add assets/js/data/ assets/trip-images/
git commit -m "更新旅遊網站內容"
git push origin main
```

### 有改前端或 scripts

```bash
git add index.html journeys.html trip.html assets/js/ scripts/ assets/trip-images/ "網站操作sop.md"
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

如果這次還有其他變動檔案，就依 `git status` 補進去。

---

## 可直接照抄版

### 純內容同步

```bash
cd "/Users/candy/jiuan 旅遊網站"
python3 scripts/notion_sync.py
node scripts/validate-trip-data.js
git status
git add assets/js/data/ assets/trip-images/
git commit -m "更新旅遊網站內容"
git push origin main
```

### 內容同步＋前端一起上版

```bash
cd "/Users/candy/jiuan 旅遊網站"
python3 scripts/notion_sync.py
node scripts/validate-trip-data.js
git status
git add index.html journeys.html trip.html assets/js/ scripts/ assets/trip-images/ "網站操作sop.md"
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

---

## 常見錯誤

### `pathspec did not match any files`

通常是：

- 不在專案根目錄
- `git add` 寫了這次根本沒變的檔案
- 路徑打錯

先做：

```bash
cd "/Users/candy/jiuan 旅遊網站"
git status
```

---

### `no changes added to commit`

代表你還沒成功 `git add` 就先 `git commit`。

先做：

```bash
git status
```

---

### `fatal: remote part of refspec is not a valid name`

通常是你把兩條指令接成同一行了。

例如 `git push origin main` 和下一條 `git add ...` 黏在一起。

**每條指令都要分開執行。**
