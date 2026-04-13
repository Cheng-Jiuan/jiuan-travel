function renderTripCountryCardsSection(trip, detail, hasGuide) {
  if (!detail || !detail.countries || !detail.countries.length) return '';

  var html = '';
  html += '<section class="sticky top-[52px] z-40 mt-8 bg-white/78 backdrop-blur-xl py-4 border-y border-slate-200/70 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.32)]"><div class="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-3">';
  html += '<button type="button" class="trip-filter-btn active px-6 py-2 rounded-full text-xs font-bold transition-all bg-white border border-slate-200 text-slate-600 hover:border-sky-300" data-trip-filter="all">全部文章</button>';
  detail.countries.forEach(function (country) {
    html += '<button type="button" class="trip-filter-btn px-6 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:border-sky-300 transition-all" data-trip-filter="' + escapeHtml(country.name) + '">' + escapeHtml(country.name) + '</button>';
  });
  html += '</div></section>';

  html += '<div class="max-w-5xl mx-auto px-4 py-10 pb-24">';
  html += '<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p class="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-700/60">Country Notes</p><h2 class="mt-2 text-2xl font-semibold text-slate-900">' + (hasGuide ? '旅程資料卡' : '各國說明') + '</h2></div>';
  if (hasGuide) html += '<p class="max-w-md text-sm leading-6 text-slate-500 shrink-0">呼應上方長文，這裡用資料卡快速整理地點、美食與瞬間，閱讀起來更像正式旅遊網站。</p>';
  html += '</div>';

  detail.countries.forEach(function (country) {
    var spots = country.journeySpots;
    var teaser = '';
    if (country.moments) {
      teaser = String(country.moments).split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean)[0] || '';
      if (teaser.length > 96) teaser = teaser.slice(0, 96) + '…';
    }
    if (!teaser && Array.isArray(spots) && spots.length) teaser = spots[0];
    if (!teaser && spots && typeof spots === 'string') teaser = spots.split('\n')[0];

    html += '<article data-country="' + escapeHtml(country.name) + '" class="trip-country-article flex flex-col md:flex-row bg-white/92 rounded-[2rem] border border-slate-200/80 overflow-hidden shadow-[0_24px_50px_-32px_rgba(15,23,42,0.28)] mb-10 backdrop-blur">';
    html += '<div class="md:w-2/5 aspect-video md:aspect-auto md:min-h-[260px] overflow-hidden bg-gray-100">';
    var countrySeeds = {'日本':'tokyo','韓國':'seoul','越南':'vietnam','馬來西亞':'borneo','香港':'hongkong','柬埔寨':'angkor','泰國':'thailand','挪威':'norway','丹麥':'copenhagen','瑞典':'stockholm','西班牙':'spain','葡萄牙':'lisbon','義大利':'italy','奧地利':'vienna','匈牙利':'budapest','捷克':'prague','波蘭':'warsaw','比利時':'brussels','荷蘭':'amsterdam','德國':'berlin','芬蘭':'finland','英國':'london','法國':'paris','智利':'chile','波利維亞':'bolivia','秘魯':'peru'};
    var imgSeed = countrySeeds[country.name] || (country.name ? country.name.charCodeAt(0) : 'travel');
    html += '<img src="https://picsum.photos/seed/' + imgSeed + '/800/600" alt="" class="w-full h-full object-cover"></div>';
    html += '<div class="p-8 md:w-3/5 flex flex-col justify-center">';
    html += '<span class="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded w-fit mb-3">國家</span>';
    html += '<h3 class="text-2xl font-bold text-gray-900 mb-3">' + escapeHtml(country.name) + '</h3>';
    if (teaser) html += '<p class="text-sm text-gray-500 leading-relaxed mb-6">' + escapeHtml(teaser) + '</p>';
    html += '<div class="space-y-5 border-t border-gray-50 pt-6">';
    html += '<div><h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">旅程地點</h4>';
    if (Array.isArray(spots)) {
      html += '<ul class="list-none pl-0 text-sm text-gray-700 space-y-2">';
      spots.forEach(function (spot) {
        var label;
        var url;
        if (spot && typeof spot === 'object') {
          label = spot.name || '';
          url = spot.mapUrl || null;
        } else {
          label = String(spot);
          url = null;
        }
        if (url) html += '<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span><span>' + escapeHtml(label) + '</span><a href="' + escapeHtml(url) + '" target="_blank" rel="noopener" class="shrink-0 text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-100 px-2 py-0.5 rounded-full transition-colors">地圖</a></li>';
        else html += '<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span><span>' + escapeHtml(label) + '</span></li>';
      });
      html += '</ul>';
    } else if (spots) {
      html += '<p class="text-sm text-gray-700 whitespace-pre-line">' + escapeHtml(spots) + '</p>';
    } else {
      html += '<p class="text-sm text-gray-400">（待補）</p>';
    }
    html += '</div>';
    html += '<div><h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">美食</h4><p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">' + (country.food ? escapeHtml(country.food) : '（待補）') + '</p></div>';
    html += '<div><h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">深刻瞬間</h4><p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">' + (country.moments ? escapeHtml(country.moments) : '（待補）') + '</p></div>';
    if (country.practicalNotes) html += '<div><h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">實用備註</h4><p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">' + escapeHtml(country.practicalNotes) + '</p></div>';
    if (country.faq && country.faq.length) {
      html += '<div><h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">常見問題</h4><dl class="space-y-3">';
      country.faq.forEach(function (item) {
        html += '<div class="rounded-lg bg-gray-50/80 border border-gray-100 px-3 py-2.5"><dt class="text-sm font-semibold text-gray-900">' + escapeHtml(item.q) + '</dt><dd class="mt-1 text-sm text-gray-600 leading-relaxed">' + escapeHtml(item.a) + '</dd></div>';
      });
      html += '</dl></div>';
    }
    if (country.readingLinks && country.readingLinks.length) {
      html += '<div class="text-sm text-gray-600"><span class="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">延伸</span>';
      html += country.readingLinks.map(function (link, i) {
        return (i ? ' · ' : '') + '<a href="' + escapeHtml(link.href) + '" class="text-sky-700 font-medium hover:underline">' + escapeHtml(link.label) + '</a>';
      }).join('');
      html += '</div>';
    }
    html += '</div><div class="pt-4 mt-2 border-t border-gray-50 text-[11px] text-gray-400">' + escapeHtml(trip.name) + '</div></div></article>';
  });
  html += '</div>';
  return html;
}

function bindTripCountryFilters(root) {
  var buttons = root.querySelectorAll('.trip-filter-btn');
  var articles = root.querySelectorAll('.trip-country-article');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var target = button.getAttribute('data-trip-filter');
      buttons.forEach(function (btn) { btn.classList.remove('active'); });
      button.classList.add('active');
      articles.forEach(function (article) {
        var country = article.getAttribute('data-country');
        article.style.display = target === 'all' || country === target ? '' : 'none';
      });
    });
  });
}
