function renderSiteFooter(target, variant) {
  if (!target) return;

  var html = '';
  if (variant === 'home') {
    html = '<footer class="bg-white border-t border-gray-100 py-16 text-center space-y-2">'
      + '<p class="text-sm text-gray-500"><a href="year-log.html" class="text-sky-600 font-medium hover:underline">年份記錄</a></p>'
      + '<p class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">© 2026 Jiuan\'s Travel. All rights reserved.</p>'
      + '</footer>';
  } else if (variant === 'journeys') {
    html = '<footer class="border-t border-[var(--line)] bg-white/70 py-10 text-center backdrop-blur"><p class="text-[10px] uppercase tracking-[0.24em] text-[var(--sea)]/55">© 2026 Jiuan\'s Travel · Journey Index</p></footer>';
  } else if (variant === 'trip') {
    html = '<footer class="bg-white border-t border-gray-100 py-10 text-center"><p class="text-[10px] text-gray-400 uppercase tracking-[0.2em]">© 2026 Jiuan\'s Travel</p></footer>';
  }

  target.innerHTML = html;
}
