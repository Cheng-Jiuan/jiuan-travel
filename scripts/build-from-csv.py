#!/usr/bin/env python3
"""將 data/旅程總覽表.csv、data/旅行日誌.csv 轉成 trips-data.js、journal-data.js。更新 Notion 後請覆寫 data/*.csv 再執行此腳本。"""
import csv
import json
import os
import re
import shutil
import hashlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def parse_zh_date_range(s):
    if not s or not s.strip():
        return None, None
    parts = s.split("→")
    if len(parts) != 2:
        return None, None
    def one(x):
        m = re.search(r"(\d{4})年(\d{1,2})月(\d{1,2})日", x.strip())
        if not m:
            return None
        y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        return f"{y:04d}-{mo:02d}-{d:02d}"
    return one(parts[0]), one(parts[1])

def split_cs(s):
    if not s:
        return []
    return [x.strip() for x in re.split(r"[,，]", s) if x.strip()]

def slug(s):
    h = hashlib.md5(s.encode("utf-8")).hexdigest()[:10]
    return re.sub(r"[^\w\u4e00-\u9fff]+", "-", s)[:48].strip("-") or f"id-{h}"

IMG = {
    "東北亞": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200",
    "北歐": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1200",
    "南歐": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200",
    "中歐": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200",
    "東歐": "https://images.unsplash.com/photo-1541849546-21654923e1922?q=80&w=1200",
    "西歐": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200",
    "東南亞": "https://images.unsplash.com/photo-1528181304800-259b08848561?q=80&w=1200",
    "南美洲": "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200",
}

FEATURED = {
    "日本東京胖胖團",
    "跨足南美洲的挑戰",
    "印加古文化之旅",
    "目前的第一名義大利",
    "超乎想像的河內之旅",
    "排名前三西班牙",
}

HEADER = r'''/**
 * 旅程資料 — 由 Notion 匯出 CSV「旅程總覽表」產生（見 data/旅程總覽表.csv）。
 * featured: true 顯示於首頁精選攻略。
 */
function escapeHtml(s) {
  if (s == null) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/** 精選攻略／全部旅程卡片：預設進入「每趟旅行」詳情頁，含各國模板 */
function tripDetailUrl(t) {
  if (t.href && t.href !== '#' && t.href.indexOf('trip.html') !== 0) {
    return t.href;
  }
  return 'trip.html?id=' + encodeURIComponent(t.id);
}

function renderTripCardHTML(t) {
  var h = escapeHtml(tripDetailUrl(t));
  var name = escapeHtml(t.name);
  var summary = escapeHtml(t.summary);
  var img = escapeHtml(t.image);
  var tag = escapeHtml(t.tag);
  return (
    '<a href="' + h + '" class="group block rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all">' +
    '<div class="aspect-[3/2] overflow-hidden bg-gray-100">' +
    '<img src="' + img + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">' +
    '</div>' +
    '<div class="p-6">' +
    '<h3 class="font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">' + name + '</h3>' +
    '<p class="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">' + summary + '</p>' +
    '<div class="mt-4 flex gap-2"><span class="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold">#' + tag + '</span></div>' +
    '</div></a>'
  );
}

var TRIPS_DATA = '''

def main():
    csv1 = os.path.join(ROOT, "data", "旅程總覽表.csv")
    csv2 = os.path.join(ROOT, "data", "旅行日誌.csv")
    if not os.path.isfile(csv1):
        print("缺少", csv1)
        return 1

    rows = []
    with open(csv1, "r", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            name = (row.get("名稱") or "").strip()
            if not name:
                continue
            zhou = (row.get("洲") or "").strip()
            reg = ["南美"] if zhou == "南美洲" else ([zhou] if zhou else [])
            countries = split_cs(row.get("國家") or "")
            cities = split_cs(row.get("城市") or "")
            summary = (row.get("摘要") or "").strip() or "—"
            try:
                year = int(float((row.get("旅遊年份") or "").strip() or 0))
            except ValueError:
                year = 0
            dr = (row.get("日期") or "").strip()
            start, end = parse_zh_date_range(dr)
            try:
                days = int(float((row.get("總天數") or "").strip() or 0))
            except ValueError:
                days = 0
            tag = countries[0] if countries else (zhou or "旅行")
            href = "#"
            cover = (row.get("封面圖") or "").strip()
            image = cover if cover.startswith("http") else IMG.get(zhou, IMG["東南亞"])
            rows.append({
                "id": slug(name),
                "name": name,
                "summary": summary,
                "image": image,
                "href": href,
                "tag": tag,
                "regions": reg,
                "countries": countries,
                "cities": cities,
                "year": year,
                "days": days,
                "start": start or "",
                "end": end or "",
                "status": "已完成",
                "featured": name in FEATURED,
            })

    with open(os.path.join(ROOT, "trips-data.js"), "w", encoding="utf-8") as out:
        out.write(HEADER)
        out.write(json.dumps(rows, ensure_ascii=False, indent=2))
        out.write(";\n")

    journal = []
    if os.path.isfile(csv2):
        with open(csv2, "r", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                title = (row.get("名稱") or "").strip()
                if not title or title.startswith("Screenshot"):
                    continue
                raw_j = (row.get("所屬旅程") or "").strip()
                journey = re.sub(r"\s*\(https?://[^\)]+\)", "", raw_j).strip()
                journal.append({
                    "title": title,
                    "country": (row.get("國家") or "").strip(),
                    "city": (row.get("所在城市") or "").strip(),
                    "journey": journey,
                    "dayLabel": (row.get("旅行天數") or "").strip(),
                    "range": (row.get("旅行日期") or "").strip(),
                    "date": (row.get("日期") or "").strip(),
                    "totalDays": (row.get("總天數") or "").strip(),
                })
        with open(os.path.join(ROOT, "journal-data.js"), "w", encoding="utf-8") as out:
            out.write("/** 旅行日誌 — 由 data/旅行日誌.csv 產生 */\n")
            out.write("var JOURNAL_ENTRIES = ")
            out.write(json.dumps(journal, ensure_ascii=False, indent=2))
            out.write(";\n")

    print("trips:", len(rows), " journal:", len(journal))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
