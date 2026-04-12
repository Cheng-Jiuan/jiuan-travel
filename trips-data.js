/**
 * 旅程資料
 */

function escapeHtml(s) {

  if (s == null) return '';

  var d = document.createElement('div');

  d.textContent = s;

  return d.innerHTML;

}

function tripDetailUrl(t) {

  if (t.href && t.href !== '#' && t.href.indexOf('trip.html') !== 0) return t.href;

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

var TRIPS_DATA = [
  {
    "id": "錯過雅馬遜雨林飛機",
    "name": "錯過雅馬遜雨林飛機",
    "summary": "一段在高海拔與荒原之間反覆被風景震住的南美旅程。",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    "href": "#",
    "tag": "南美洲",
    "regions": [
      "南美洲"
    ],
    "countries": [
      "波利維亞"
    ],
    "cities": [
      "拉巴斯"
    ],
    "year": 2026,
    "days": 9,
    "start": "2026-02-01",
    "end": "",
    "status": "已發佈",
    "featured": false
  }
];
