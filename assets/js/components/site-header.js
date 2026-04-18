function renderSiteHeader(target, variant) {
  if (!target) return;

  var navClass = 'site-glass-nav sticky top-0 z-50';
  var brandClass = 'display-serif text-[1.12rem] font-bold tracking-[0.01em] text-[var(--ink)]';
  var pillClass = 'chip-soft chip-soft-plain text-[0.72rem] font-bold';
  var textLinkClass = 'text-sm font-medium text-[var(--sea-deep)] transition hover:text-[var(--ink)]';
  var html = '';

  if (variant === 'journeys') {
    html = '<nav class="' + navClass + '">' 
      + '<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">'
      + '<a href="index.html" class="' + brandClass + '">Jiuan\'s Travel</a>'
      + '<div class="flex items-center gap-3 text-sm text-[var(--muted)]">'
      + '<a href="journeys.html" class="hidden sm:inline-flex ' + pillClass + ' is-active">全部旅程</a>'
      + '<a href="year-log.html" class="hidden sm:inline-flex ' + pillClass + '">年份記錄</a>'
      + '<a href="index.html" class="' + textLinkClass + '">← 回到首頁</a>'
      + '</div></div></nav>';
  } else if (variant === 'trip') {
    html = '<nav class="' + navClass + '">' 
      + '<div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">'
      + '<div class="flex items-center gap-3 min-w-0">'
      + '<a href="index.html" class="' + brandClass + ' shrink-0">Jiuan\'s Travel</a>'
      + '<a href="journeys.html" class="hidden sm:inline-flex ' + pillClass + '">全部旅程</a>'
      + '</div>'
      + '<a href="journeys.html" class="' + textLinkClass + '">← 全部旅程</a>'
      + '</div></nav>';
  }

  target.innerHTML = html;
}
