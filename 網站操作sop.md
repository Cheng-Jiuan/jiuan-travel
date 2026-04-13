# 網站操作 SOP

## 更新流程

**Notion 更新內容 → 執行同步腳本 → 跑資料驗證 → 本機檢查網站 → 確認 Git 變更 → commit → push**

---

## 可直接照抄版本

### 1. 先進入專案根目錄

```bash
cd "/Users/candy/jiuan 旅遊網站"
```

---

### 2. 從 Notion 同步資料

```bash
python3 scripts/notion_sync.py
```

成功時會看到類似：

```bash
Done! X trips synced.
```

同步後，這個專案目前會更新的重點檔案通常是：

```text
trips-data.js
trip-detail-data.js
trips/
assets/trip-images/
```

如果同步內容有牽動地圖資料，也可能看到：

```text
continent-map.js
```

---

### 3. 執行資料驗證

```bash
node scripts/validate-trip-data.js
```

重點確認：

- 沒有 `Errors`
- 若只有 `Warnings`，先判斷是不是可接受的提醒

---

### 4. 本機預覽網站

不要用 `file://` 直接開 HTML，請用本機 HTTP 預覽。

方法一：

```bash
./開啟本機預覽.command
```

方法二：

```bash
python3 -m http.server 9341
```

然後在瀏覽器打開：

```text
http://127.0.0.1:9341/index.html
```

建議至少檢查：

- `index.html`
  - 首頁導覽列是否正常
  - 精選旅程是否正常
  - 地圖是否正常載入
- `journeys.html`
  - 篩選器是否正常
  - 卡片是否有出現
  - 洲別 / 國家切換是否正常
- `trip.html?id=某個已發佈id`
  - Hero 是否正常
  - 文字段落是否正常
  - 圖片是否正常

---

### 5. 看這次到底改了哪些檔案

```bash
git status
```

如果有看到像這些，通常是正常的：

```text
modified: trips-data.js
modified: trip-detail-data.js
modified: trips/某篇旅程.js
modified: assets/trip-images/...
```

如果有看到：

```text
deleted: continent-map.js
```

代表這次同步可能把它刪掉；只要這確實是你這次要一起上版的變更，就可以一起加入 commit。

---

## 上傳 GitHub：直接照情況抄

### 情況 A：這次只有同步內容 / 圖片 / 旅程資料

請直接用這組：

```bash
git add trips-data.js trip-detail-data.js continent-map.js trips/ assets/trip-images/
git commit -m "更新旅遊網站內容"
git push origin main
```

如果 `continent-map.js` 這次沒有變動，或你執行 `git add` 時 Git 說找不到它，就改用下面這組：

```bash
git add trips-data.js trip-detail-data.js trips/ assets/trip-images/
git commit -m "更新旅遊網站內容"
git push origin main
```

---

### 情況 B：這次除了同步內容，也有改前端頁面或 JS

請用這組：

```bash
git add index.html journeys.html trip.html assets/js/ scripts/ trips/ assets/trip-images/ trips-data.js trip-detail-data.js continent-map.js
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

如果 `continent-map.js` 這次不存在或沒變動，就改成：

```bash
git add index.html journeys.html trip.html assets/js/ scripts/ trips/ assets/trip-images/ trips-data.js trip-detail-data.js
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

---

### 情況 C：這次連 SOP 也一起改了

請用這組：

```bash
git add index.html journeys.html trip.html assets/js/ scripts/ trips/ assets/trip-images/ trips-data.js trip-detail-data.js continent-map.js "網站操作sop.md"
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

如果 `continent-map.js` 這次不存在或沒變動，就改成：

```bash
git add index.html journeys.html trip.html assets/js/ scripts/ trips/ assets/trip-images/ trips-data.js trip-detail-data.js "網站操作sop.md"
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

---

## 最常用完整流程

### 純內容同步版

```bash
cd "/Users/candy/jiuan 旅遊網站"
python3 scripts/notion_sync.py
node scripts/validate-trip-data.js
git status
git add trips-data.js trip-detail-data.js trips/ assets/trip-images/
git commit -m "更新旅遊網站內容"
git push origin main
```

### 內容同步＋前端一起上版

```bash
cd "/Users/candy/jiuan 旅遊網站"
python3 scripts/notion_sync.py
node scripts/validate-trip-data.js
git status
git add index.html journeys.html trip.html assets/js/ scripts/ trips/ assets/trip-images/ trips-data.js trip-detail-data.js
git commit -m "更新旅遊網站內容與前端結構"
git push origin main
```

---

## 常見錯誤

### 1. `pathspec did not match any files`

通常代表：

- 你不在專案根目錄
- 你用了舊路徑
- 你加了這次根本沒有變動的檔案

先回到專案根目錄：

```bash
cd "/Users/candy/jiuan 旅遊網站"
```

再用這個確認：

```bash
git status
```

**以 `git status` 顯示出來的檔案為準。**

---

### 2. `no changes added to commit`

代表你還沒有成功執行 `git add`，就先跑了 `git commit`。

請先：

```bash
git status
```

再把要上版的檔案 `git add` 進去後，才執行 `git commit`。

---

### 3. `fatal: remote part of refspec is not a valid name`

通常代表你把兩個指令黏成同一行了。

例如你原本想打：

```bash
git push origin main
```

下一行再打：

```bash
git add ...
```

但實際上卻打成一整行。

**每一條指令都要按一次 Enter，不要把 `git push` 和 `git add` 接在同一行。**

---

## 重點

- 先 `cd` 到專案根目錄
- 先同步，再驗證，再本機檢查，再 `git status`
- 以目前專案實際路徑為準，不要再用舊的 `assets/js/data/...`
- `git commit` 前一定要先 `git add`
- `git push origin main` 要單獨一行執行
