function renderTripHeroSection(trip) {
  var tripTime = tripTimeLabel(trip);
  var heroImage = escapeHtml(resolveImagePath(trip.image));
  var pillClass = 'travel-pill chip-soft chip-soft-plain';
  var html = '';
  html += '<header class="relative overflow-hidden">';
  html += '<div class="relative h-[min(50vh,500px)] w-full overflow-hidden bg-[#efe7dc]">';
  html += '<img src="' + heroImage + '" alt="" class="absolute inset-0 h-full w-full object-cover object-center opacity-[0.9] scale-[1.01]">';
  html += '<div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,243,0.94)_0%,rgba(251,248,243,0.72)_36%,rgba(251,248,243,0.16)_64%,rgba(251,248,243,0.08)_100%)]"></div>';
  html += '<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(181,141,99,0.12),transparent_24%)]"></div>';
  html += '<div class="absolute inset-x-0 bottom-0 px-4 pb-8 md:pb-10"><div class="max-w-6xl mx-auto"><div class="hero-panel max-w-3xl rounded-[1.9rem] px-6 py-6 text-[var(--ink)] md:px-8 md:py-8">';
  html += '<p class="mb-3 display-serif text-[0.96rem] font-semibold tracking-[0.16em] text-[var(--sea-deep)]/72">Travel Guide</p>';
  html += '<h1 class="max-w-3xl display-serif text-[2.35rem] font-bold leading-[1.08] text-[var(--ink)] md:text-[3.9rem]">' + escapeHtml(trip.name) + '</h1>';
  if (trip.summary) html += '<p class="mt-4 max-w-2xl text-[15px] leading-8 text-[var(--ink)]/76 md:text-[1rem]">' + escapeHtml(trip.summary) + '</p>';
  html += '<div class="mt-6 flex flex-wrap gap-2">';
  if (trip.year) html += '<span class="' + pillClass + '">✦ ' + trip.year + '</span>';
  if (trip.days) html += '<span class="' + pillClass + '">⏳ 共 ' + trip.days + ' 天</span>';
  if (tripTime) html += '<span class="' + pillClass + '">🗓 ' + escapeHtml(tripTime) + '</span>';
  if (trip.countries && trip.countries.length) html += '<span class="' + pillClass + '">📍 ' + escapeHtml(trip.countries.join(' · ')) + '</span>';
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

  return '<section class="px-4 -mt-6 relative z-10"><div class="max-w-6xl mx-auto"><div class="rounded-[1.7rem] border border-[rgba(34,50,56,0.08)] bg-[rgba(255,255,255,0.94)] p-4 shadow-[0_18px_36px_-26px_rgba(34,50,56,0.12)] md:p-5"><div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">' + cards.join('') + '</div></div></div></section>';
}
