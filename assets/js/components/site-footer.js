function renderSiteFooter(target, variant) {
  if (!target) return;

  var base = 'border-t border-[var(--line)] bg-[rgba(255,255,255,0.72)] text-center backdrop-blur';
  var html = '';

  if (variant === 'home') {
    html = '<footer class="' + base + ' py-14">'
      + '<p class="text-sm text-[var(--muted)]"><a href="year-log.html" class="font-medium text-[var(--sea-deep)] hover:underline">年份記錄</a></p>'
      + '<p class="mt-2 text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]/72">© 2026 Jiuan\'s Travel. All rights reserved.</p>'
      + '</footer>';
  } else if (variant === 'journeys') {
    html = '<footer class="' + base + ' py-10"><p class="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]/72">© 2026 Jiuan\'s Travel · Journey Index</p></footer>';
  } else if (variant === 'trip') {
    html = '<footer class="' + base + ' py-10"><p class="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]/72">© 2026 Jiuan\'s Travel · Travel Guide</p></footer>';
  }

  target.innerHTML = html;
}
