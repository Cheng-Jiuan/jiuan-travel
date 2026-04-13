function buildCountryLink(country, emphasize) {
  var baseClass = emphasize
    ? 'block px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50'
    : 'block px-4 py-2 text-sm hover:text-sky-600 hover:bg-sky-50 transition-colors';
  return '<a href="journeys.html?country=' + encodeURIComponent(country) + '" class="' + baseClass + '">' + country + '</a>';
}

function buildDesktopNavItem(item, index) {
  var groupName = 'nav-' + item.key;
  var groupsHtml = item.groups.map(function (group) {
    var submenuWidth = group.submenuWidth || 'min-w-[168px]';
    var countryLinks = group.countries.map(function (country) {
      return buildCountryLink(country, !!group.emphasize);
    }).join('');

    return '<div class="relative group/' + group.key + '">'
      + '<div class="px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-sky-50 flex items-center justify-between cursor-default">'
      + group.label
      + '<span class="text-gray-400 text-xs" aria-hidden="true">›</span>'
      + '</div>'
      + '<div class="mega-submenu-bridge absolute left-full top-0 bottom-0 w-[10px] z-[61]"></div>'
      + '<div class="absolute left-full top-0 pl-0 ' + submenuWidth + ' opacity-0 invisible group-hover/' + group.key + ':opacity-100 group-hover/' + group.key + ':visible z-[62]">'
      + '<div class="bg-white rounded-xl shadow-xl border border-gray-200 py-2 ml-1">'
      + countryLinks
      + '</div></div></div>';
  }).join('');

  var divider = index === HOME_NAVIGATION_DATA.length - 1
    ? ''
    : '<span class="text-sky-600 select-none shrink-0" aria-hidden="true">|</span>';

  return '<div class="relative shrink-0 group/' + groupName + '">'
    + '<button type="button" class="px-3 py-1.5 hover:bg-sky-300/60 rounded flex items-center gap-0.5 transition-colors whitespace-nowrap">'
    + item.label
    + ' <svg class="w-3 h-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>'
    + '</button>'
    + '<div class="absolute left-0 top-full pt-1.5 opacity-0 invisible group-hover/' + groupName + ':opacity-100 group-hover/' + groupName + ':visible transition-all duration-200 z-[60]">'
    + '<span class="block border-8 border-transparent border-b-white absolute left-5 -top-2 z-10"></span>'
    + '<div class="relative bg-white rounded-xl shadow-xl border border-gray-200 text-gray-800 flex overflow-visible ' + (item.panelExtraClass || '') + '">'
    + '<div class="' + (item.panelWidth || 'w-[168px]') + ' py-2 border-r border-gray-100 shrink-0">'
    + groupsHtml
    + '</div></div></div></div>'
    + divider;
}

function renderHomeNavigation(target) {
  if (!target || typeof HOME_NAVIGATION_DATA === 'undefined') return;

  var desktop = HOME_NAVIGATION_DATA.map(buildDesktopNavItem).join('');
  var mobile = HOME_NAVIGATION_DATA.map(function (item) {
    return '<a href="journeys.html?continent=' + item.key + '" class="mobile-nav-jump block py-2.5 px-3 rounded-lg text-sm font-medium text-sky-900 hover:bg-sky-300/50 transition-colors">' + item.label + '</a>';
  }).join('');

  target.innerHTML = '<div id="nav-continents" class="hidden md:flex flex-wrap items-center justify-center sm:justify-start gap-x-1 gap-y-2 text-sky-800 text-sm font-medium w-full sm:w-auto">'
    + desktop
    + '</div>'
    + '<div id="mobile-menu-panel" class="hidden md:hidden border-t border-sky-300/50 pt-3 space-y-0.5" role="navigation" aria-label="手機版快速導覽">'
    + mobile
    + '<a href="#explore-world" class="mobile-nav-jump mt-2 block py-2.5 px-3 rounded-lg text-xs font-bold text-sky-800 uppercase tracking-wider border border-sky-400/40 text-center hover:bg-sky-300/40 transition-colors">▼ 探索世界（全部區塊）</a>'
    + '<a href="journeys.html" class="mobile-nav-jump mt-1 block py-2.5 px-3 rounded-lg text-sm font-bold text-sky-900 bg-white/60 border border-sky-400/50 text-center hover:bg-white transition-colors">全部旅程（卡片列表）</a>'
    + '<a href="year-log.html" class="mobile-nav-jump block py-2.5 px-3 rounded-lg text-sm font-medium text-sky-900 hover:bg-sky-300/50 transition-colors text-center">年份記錄</a>'
    + '</div>';
}
