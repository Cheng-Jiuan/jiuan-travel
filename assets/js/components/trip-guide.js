function renderTripGuideBlocks(sections) {
  if (!sections || !sections.length) return '';
  var out = '';
  sections.forEach(function (block) {
    if (!block || !block.type) return;
    if (block.type === 'h2') {
      out += '<h2 id="' + escapeHtml(block.id) + '" class="guide-h2 scroll-mt-36">' + richText(block.text) + '</h2>';
    } else if (block.type === 'p') {
      out += '<p class="guide-p">' + richText(block.text) + '</p>';
    } else if (block.type === 'ul' && block.items) {
      out += '<ul class="guide-ul">';
      block.items.forEach(function (item) { out += '<li>' + richText(item) + '</li>'; });
      out += '</ul>';
    } else if (block.type === 'callout') {
      var ccls = block.variant === 'amber' ? 'guide-callout-amber' : 'guide-callout-sky';
      out += '<div class="' + ccls + '">';
      if (block.title) out += '<p class="text-xs font-bold uppercase tracking-widest mb-2 text-gray-800">' + richText(block.title) + '</p>';
      out += '<p class="text-sm leading-relaxed text-gray-700">' + richText(block.body) + '</p></div>';
    } else if (block.type === 'route' && block.steps) {
      out += '<div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm my-6">';
      out += '<p class="text-sm font-bold text-gray-900 mb-3">' + richText(block.title) + '</p>';
      block.steps.forEach(function (step, i) {
        out += '<div class="guide-route-step"><span class="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-800">' + (i + 1) + '</span><span class="text-gray-700">' + richText(step) + '</span></div>';
      });
      out += '</div>';
    } else if (block.type === 'infoBox' && block.rows) {
      out += '<div class="guide-info-box">';
      if (block.title) out += '<p class="text-sm font-bold text-gray-800 mb-3">' + richText(block.title) + '</p>';
      block.rows.forEach(function (row) {
        out += '<div class="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-gray-200/80 last:border-0 text-sm">';
        out += '<span class="shrink-0 font-semibold text-sky-700 w-28">' + richText(row.label) + '</span>';
        out += '<span class="text-gray-600 leading-relaxed">' + richText(row.value) + '</span></div>';
      });
      out += '</div>';
    } else if (block.type === 'blockquote') {
      out += '<blockquote class="guide-blockquote">' + richText(block.text) + '</blockquote>';
    } else if (block.type === 'photos' && block.items && block.items.length) {
      out += '<div class="my-10 space-y-5">';
      block.items.forEach(function (photo) {
        out += '<figure class="group mx-auto max-w-2xl overflow-hidden rounded-[1.4rem] border border-[rgba(22,48,56,0.08)] bg-white shadow-[0_16px_36px_-28px_rgba(15,23,42,0.22)]">';
        out += '<div class="aspect-[4/3] overflow-hidden bg-slate-100">';
        out += '<img src="' + escapeHtml(photo.src) + '" alt="' + escapeHtml(photo.caption || '') + '" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.insertAdjacentHTML(\'beforeend\',\'<div class=&quot;flex h-full items-center justify-center px-6 text-center text-sm leading-6 text-slate-400&quot;>圖片載入失敗，請檢查 assets 路徑或檔名</div>\')">';
        out += '</div>';
        if (photo.caption) out += '<figcaption class="border-t border-slate-100 bg-[rgba(248,250,252,0.72)] px-4 py-2.5 text-[12px] italic leading-6 text-slate-500">' + escapeHtml(photo.caption) + '</figcaption>';
        out += '</figure>';
      });
      out += '</div>';
    } else if (block.type === 'faq' && block.items) {
      out += '<dl class="space-y-3 mt-2">';
      block.items.forEach(function (item) {
        out += '<div class="rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm">';
        out += '<dt class="text-sm font-semibold text-gray-900">' + richText(item.q) + '</dt>';
        out += '<dd class="mt-1.5 text-sm text-gray-600 leading-relaxed">' + richText(item.a) + '</dd></div>';
      });
      out += '</dl>';
    }
  });
  return out;
}

function buildTripGuideTocNav(toc, className) {
  if (!toc || !toc.length) return '';
  var navClass = className || 'guide-toc';
  var links = toc.map(function (item) {
    return '<a href="#' + escapeHtml(item.id) + '">' + escapeHtml(item.title) + '</a>';
  }).join('');
  return '<nav class="' + navClass + '" aria-label="文章目錄">' + links + '</nav>';
}

function renderTripGuideSection(trip, guide) {
  if (!guide || !guide.sections || !guide.sections.length) {
    return '<section class="px-4 pt-8 md:pt-10"><div class="article-shell max-w-4xl mx-auto rounded-[2rem] px-6 py-12 text-center md:px-10 md:py-16"><div class="flex justify-center mb-6"><div class="w-px h-12 bg-sky-300"></div></div><p class="text-lg md:text-xl font-serif italic text-gray-800 leading-relaxed">' + escapeHtml(trip.summary) + '</p></div></section>';
  }

  var html = '';
  html += '<section class="px-4 pt-8 md:pt-10">';
  html += '<div class="article-shell max-w-6xl mx-auto rounded-[2rem] px-5 py-6 md:px-8 md:py-8">';
  html += '<div class="border-b border-slate-200/80 pb-6">';
  if (guide.eyebrow) html += '<p class="text-[11px] font-bold tracking-[0.32em] text-[var(--sea)]/80 uppercase mb-3">' + escapeHtml(guide.eyebrow) + '</p>';
  html += '<div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-5">';
  html += '<span class="rounded-full bg-[var(--ink)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">Guide Note</span>';
  if (trip.cities && trip.cities.length) {
    trip.cities.forEach(function (city) {
      html += '<span class="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">' + escapeHtml(city) + '</span>';
    });
  }
  html += '</div>';
  if (guide.lead) html += '<p class="max-w-3xl text-lg leading-8 text-slate-800 md:text-[1.35rem] md:leading-9">' + richText(guide.lead) + '</p>';
  html += '</div>';
  html += '<div class="pt-8 md:pt-10">';
  html += '<details class="lg:hidden mb-8 rounded-[1.5rem] border border-[rgba(31,85,96,0.1)] bg-[var(--foam)]/70 p-4 shadow-sm">';
  html += '<summary class="cursor-pointer list-none text-sm font-bold text-[var(--ink)] [&::-webkit-details-marker]:hidden flex items-center justify-between gap-2"><span>重點整理（目錄）</span><span class="text-[var(--sea)] text-xs">點擊展開</span></summary>';
  html += '<div class="mt-4 pl-0.5">' + buildTripGuideTocNav(guide.toc) + '</div></details>';
  html += '<div class="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">';
  html += '<aside class="hidden lg:block"><div class="sticky top-24 rounded-[1.7rem] border border-[rgba(22,48,56,0.09)] bg-white/88 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.22)] backdrop-blur"><p class="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--sea)]/45 mb-3">重點整理</p>' + buildTripGuideTocNav(guide.toc) + '</div></aside>';
  html += '<div class="guide-prose min-w-0 max-w-3xl">' + renderTripGuideBlocks(guide.sections) + '</div>';
  html += '</div></div></div></section>';
  return html;
}
