function renderSiteHeader(target, variant) {
  if (!target) return;

  var html = '';
  if (variant === 'journeys') {
    html = '<nav class="sticky top-0 z-50 border-b border-sky-200/70 bg-[rgba(244,248,248,0.94)] shadow-sm backdrop-blur-xl">'
      + '<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">'
      + '<a href="index.html" class="text-lg font-black tracking-tight text-sky-800">Jiuan\'s Travel</a>'
      + '<div class="flex items-center gap-3 text-sm font-medium text-sky-900/80">'
      + '<span class="hidden sm:inline">全部旅程</span>'
      + '<a href="year-log.html" class="hidden sm:inline-flex rounded-full border border-sky-300 bg-white/80 px-3 py-1.5 transition hover:bg-sky-50 hover:text-sky-900">年份記錄</a>'
      + '<a href="index.html" class="transition hover:text-sky-700">← 回到首頁</a>'
      + '</div></div></nav>';
  } else if (variant === 'trip') {
    html = '<nav class="sticky top-0 z-50 border-b border-sky-200/70 bg-[rgba(244,248,248,0.92)] shadow-sm backdrop-blur-xl">'
      + '<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">'
      + '<div class="flex items-center gap-3 min-w-0">'
      + '<a href="index.html" class="text-sky-800 font-black text-lg tracking-tight shrink-0">Jiuan\'s Travel</a>'
      + '<a href="journeys.html" class="hidden sm:inline-flex text-xs font-bold text-sky-800 hover:text-sky-700 border border-sky-300 rounded-full px-3 py-1 transition-colors whitespace-nowrap bg-white/70">全部旅程</a>'
      + '</div>'
      + '<a href="journeys.html" class="text-sm font-medium text-sky-800 hover:text-sky-700">← 全部旅程</a>'
      + '</div></nav>';
  }

  target.innerHTML = html;
}
