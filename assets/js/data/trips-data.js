/**

 * 旅程資料 — 由 notion_sync.py 自動同步產生。

 * featured: true 顯示於首頁精選攻略。

 */

function escapeHtml(s) {

  if (s == null) return '';

  var d = document.createElement('div');

  d.textContent = s;

  return d.innerHTML;

}

function tripDetailUrl(t) {

  if (t.href && t.href !== '#' && t.href.indexOf('trip.html') !== 0) return t.href;

  return 'trip.html?slug=' + encodeURIComponent(t.slug);

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

var TRIPS_DATA = [
  {
    "slug": "amazon-rainforest",
    "name": "亞馬遜雨林：大自然動物交響曲",
    "summary": "那些錯過的事，帶走了我對「掌控」的執著。",
    "image": "local: assets/trip-images/錯過雅馬遜雨林飛機/00.jpg",
    "href": "#",
    "tag": "南美洲",
    "regions": [
      "南美洲"
    ],
    "countries": [
      "波利維亞"
    ],
    "cities": [
      "Rurrenabaque",
      "La Paz"
    ],
    "year": 2026,
    "days": 5,
    "start": "2026-02-01",
    "end": "",
    "status": "已發佈",
    "featured": false
  },
  {
    "slug": "test",
    "name": "測測",
    "summary": "測",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    "href": "#",
    "tag": "",
    "regions": [],
    "countries": [],
    "cities": [],
    "year": 2025,
    "days": 2,
    "start": "2025-04-11",
    "end": "",
    "status": "草稿",
    "featured": false
  },
  {
    "slug": "thailand-cambodia-travel",
    "name": "歷史交織的國度：泰國、柬埔寨",
    "summary": "走訪泰國與柬埔寨，感受現代都市與千年遺蹟的強烈對比。從大小吳哥的千年文化，看見高棉王朝昔日的輝煌巔峰；也看見了紅色高棉後重生與掙扎的強烈對比。",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    "href": "#",
    "tag": "東南亞",
    "regions": [
      "東南亞"
    ],
    "countries": [
      "柬埔寨",
      "泰國"
    ],
    "cities": [
      "金邊",
      "暹粒",
      "曼谷"
    ],
    "year": 2025,
    "days": 9,
    "start": "2025-10-02",
    "end": "",
    "status": "已發佈",
    "featured": true
  }
];
