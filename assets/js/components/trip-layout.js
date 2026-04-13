function renderTripHeroSection(trip) {
  var tripTime = tripTimeLabel(trip);
  var html = '';
  html += '<header class="relative overflow-hidden">';
  html += '<div class="relative h-[min(48vh,460px)] w-full overflow-hidden">';
  html += '<img src="' + escapeHtml(trip.image) + '" alt="" class="w-full h-full object-cover">';
  html += '<div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,22,0.16),rgba(12,29,34,0.38),rgba(12,29,34,0.78))]"></div>';
  html += '<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(31,85,96,0.22),transparent_30%)]"></div>';
  html += '<div class="absolute inset-x-0 bottom-0 px-4 pb-8 md:pb-10"><div class="max-w-6xl mx-auto"><div class="max-w-3xl rounded-[2rem] border border-white/12 bg-[rgba(10,20,24,0.28)] px-6 py-6 text-white shadow-[0_28px_60px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl md:px-8 md:py-8">';
  html += '<p class="text-[11px] font-bold uppercase tracking-[0.34em] text-white/60 mb-3">Travel Guide · Jiuan\'s Travel</p>';
  html += '<h1 class="max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl lg:text-[3.9rem] lg:leading-[1.05]">' + escapeHtml(trip.name) + '</h1>';
  if (trip.summary) html += '<p class="mt-4 max-w-2xl text-sm leading-7 text-white/82 md:text-base">' + escapeHtml(trip.summary) + '</p>';
  html += '<div class="mt-5 flex flex-wrap gap-2">';
  if (trip.year) html += '<span class="travel-pill">✦ ' + trip.year + '</span>';
  if (trip.days) html += '<span class="travel-pill">⏳ 共 ' + trip.days + ' 天</span>';
  if (tripTime) html += '<span class="travel-pill">🗓 ' + escapeHtml(tripTime) + '</span>';
  if (trip.countries && trip.countries.length) html += '<span class="travel-pill">📍 ' + escapeHtml(trip.countries.join(' · ')) + '</span>';
  html += '</div></div></div></div></div></header>';
  return html;
}

function renderTripFactsSection(trip) {
  function factCard(label, value, tone) {
    if (!value) return '';
    var toneClass = tone === 'accent'
      ? 'text-[var(--sea)] bg-[var(--foam)] border-[rgba(31,85,96,0.12)]'
      : tone === 'warm'
        ? 'text-[#8a5a2f] bg-[#fff8ef] border-[rgba(216,141,77,0.18)]'
        : 'text-slate-700 bg-white/80 border-slate-200/80';
    return '<div class="quick-fact-card rounded-[1.4rem] px-4 py-3 ' + toneClass + '"><p class="text-[10px] font-bold uppercase tracking-[0.24em] opacity-55">' + escapeHtml(label) + '</p><p class="mt-2 text-sm font-semibold leading-6">' + escapeHtml(value) + '</p></div>';
  }

  var cards = [];
  if (trip.countries && trip.countries.length) cards.push(factCard('國家', trip.countries.join(' · '), 'accent'));
  if (trip.cities && trip.cities.length) cards.push(factCard('城市', trip.cities.join(' · '), 'neutral'));
  if (trip.days) cards.push(factCard('旅程天數', '共 ' + trip.days + ' 天', 'warm'));
  var time = tripTimeLabel(trip);
  if (time) cards.push(factCard('旅行時間', time, 'neutral'));
  if (!cards.length) return '';

  return '<section class="px-4 -mt-8 relative z-10"><div class="max-w-6xl mx-auto"><div class="rounded-[1.8rem] border border-[rgba(22,48,56,0.08)] bg-white/92 p-4 shadow-[0_24px_55px_-34px_rgba(15,23,42,0.24)] backdrop-blur md:p-5"><div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">' + cards.join('') + '</div></div></div></section>';
}
