function buildCountryLink(country, emphasize) {
  var baseClass = emphasize
    ? 'block px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50'
    : 'block px-4 py-2 text-sm hover:text-sky-600 hover:bg-sky-50 transition-colors';
  return '<a href="journeys.html?country=' + encodeURIComponent(country) + '" class="' + baseClass + '">' + country + '</a>';
}

var HOME_NAVIGATION_DATA = [
  {
    key: 'asia',
    label: '亞洲',
    panelWidth: 'w-[168px]',
    groups: [
      { key: 'asia-east', label: '東北亞', countries: ['日本', '韓國'] },
      { key: 'asia-southeast', label: '東南亞', countries: ['越南', '柬埔寨', '泰國', '馬來西亞'] }
    ]
  },
  {
    key: 'europe',
    label: '歐洲',
    panelWidth: 'w-[168px]',
    groups: [
      { key: 'europe-north', label: '北歐', countries: ['丹麥', '瑞典', '挪威'] },
      { key: 'europe-west', label: '西歐', countries: ['英國', '法國'] },
      { key: 'europe-south', label: '南歐', countries: ['西班牙', '葡萄牙', '義大利'] },
      { key: 'europe-central', label: '中歐 / 東歐', countries: ['奧地利', '匈牙利', '捷克', '波蘭'] }
    ]
  },
  {
    key: 'africa',
    label: '非洲',
    panelWidth: 'w-[168px]',
    groups: [
      { key: 'africa-main', label: '非洲', countries: ['埃及'] }
    ]
  },
  {
    key: 'americas',
    label: '美洲',
    panelWidth: 'w-[168px]',
    groups: [
      { key: 'americas-south', label: '南美洲', countries: ['秘魯', '波利維亞', '智利'], emphasize: true }
    ]
  },
  {
    key: 'oceania',
    label: '大洋洲',
    panelWidth: 'w-[168px]',
    groups: [
      { key: 'oceania-main', label: '大洋洲', countries: ['澳洲'] }
    ]
  }
];
