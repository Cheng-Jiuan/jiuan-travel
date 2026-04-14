function validateTripData() {
  if (typeof TRIPS_DATA === 'undefined' || typeof TRIP_DETAILS === 'undefined') return;

  var tripIds = (TRIPS_DATA || []).map(function (trip) {
    return trip && trip.id;
  }).filter(Boolean);

  var detailIds = Object.keys(TRIP_DETAILS || {});

  var missingDetails = tripIds.filter(function (id) {
    return detailIds.indexOf(id) === -1;
  });

  var orphanDetails = detailIds.filter(function (id) {
    return tripIds.indexOf(id) === -1;
  });

  if (missingDetails.length || orphanDetails.length) {
    console.warn('[trip-data] 資料索引不一致', {
      missingDetails: missingDetails,
      orphanDetails: orphanDetails
    });
  }
}

(function () {
  validateTripData();
  renderSiteHeader(document.getElementById('site-header'), 'trip');
  renderSiteFooter(document.getElementById('site-footer'), 'trip');

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var root = document.getElementById('trip-root');

  if (!id || typeof TRIPS_DATA === 'undefined') {
    root.innerHTML = '<div class="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">找不到旅程。請從<a href="journeys.html" class="text-sky-600 underline">全部旅程</a>進入。</div>';
    document.title = '找不到旅程 - Jiuan\'s Travel';
    return;
  }

  var trip = findTripById(getPublishedTrips(TRIPS_DATA), id);
  if (!trip) {
    root.innerHTML = '<div class="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">找不到此趟旅程。</div>';
    return;
  }

  document.title = trip.name + ' - Jiuan\'s Travel';

  var detail = (typeof TRIP_DETAILS !== 'undefined' && TRIP_DETAILS[id]) ? TRIP_DETAILS[id] : null;
  var guide = detail && detail.guide ? detail.guide : null;
  var hasGuide = !!(guide && guide.sections && guide.sections.length);
  var hasCountries = !!(detail && detail.countries && detail.countries.length);

  var html = '';

  if (hasGuide || hasCountries) {
    html += renderTripHeroSection(trip);
    html += renderTripFactsSection(trip);
    html += renderTripGuideSection(trip, guide);
    if (hasCountries) html += renderTripCountryCardsSection(trip, detail, hasGuide);
  } else {
    html += '<header class="mb-10 max-w-3xl mx-auto px-4 pt-10">';
    html += '<p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">精選攻略 · 每趟旅行</p>';
    html += '<h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">' + escapeHtml(trip.name) + '</h1>';
    html += '<p class="mt-3 text-gray-600 text-sm leading-relaxed">' + escapeHtml(trip.summary) + '</p>';
    html += '<div class="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">';
    if (trip.year) html += '<span class="px-2 py-1 rounded-lg bg-white border border-gray-200">' + trip.year + '</span>';
    if (trip.days) html += '<span class="px-2 py-1 rounded-lg bg-white border border-gray-200">共 ' + trip.days + ' 天</span>';
    html += '</div></header>';
    html += '<div class="max-w-3xl mx-auto px-4 pb-20 rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 p-6 text-sm text-amber-900">';
    html += '<p class="font-bold mb-2">此趟旅程尚未建立各國詳細內容</p>';
    html += '<p class="text-amber-800/90">之後補上各國的旅程地點、美食與故事後，就會以與其他攻略相同的版型呈現。</p>';
    html += '</div>';
  }

  root.innerHTML = html;

  if (hasCountries) bindTripCountryFilters(root);
})();
