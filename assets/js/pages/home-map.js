(function () {
  if (typeof L === 'undefined' || typeof TRIPS_DATA === 'undefined') return;

  var COORDS = {
    '東京':[35.6762,139.6503],'大阪':[34.6937,135.5023],'京都':[35.0116,135.7681],'日本':[36.2048,138.2529],
    '首爾':[37.5665,126.9780],'釜山':[35.1796,129.0756],'韓國':[35.9078,127.7669],
    '台北':[25.0330,121.5654],'台灣':[23.6978,120.9605],
    '香港':[22.3193,114.1694],'澳門':[22.1987,113.5439],
    '曼谷':[13.7563,100.5018],'清邁':[18.7883,98.9853],'泰國':[15.8700,100.9925],
    '新加坡':[1.3521,103.8198],'吉隆坡':[3.1390,101.6869],'馬來西亞':[4.2105,101.9758],
    '峇里島':[-8.3405,115.0920],'印尼':[-0.7893,113.9213],
    '河內':[21.0278,105.8342],'胡志明市':[10.8231,106.6297],'越南':[14.0583,108.2772],
    '暹粒':[13.3671,103.8448],'金邊':[11.5564,104.9282],'柬埔寨':[12.5657,104.9910],
    '倫敦':[51.5074,-0.1278],'英國':[55.3781,-3.4360],
    '巴黎':[48.8566,2.3522],'法國':[46.2276,2.2137],
    '羅馬':[41.9028,12.4964],'義大利':[41.8719,12.5674],
    '巴塞隆納':[41.3851,2.1734],'西班牙':[40.4637,-3.7492],
    '阿姆斯特丹':[52.3676,4.9041],'荷蘭':[52.1326,5.2913],
    '柏林':[52.5200,13.4050],'德國':[51.1657,10.4515],
    '維也納':[48.2082,16.3738],'奧地利':[47.5162,14.5501],
    '布拉格':[50.0755,14.4378],'捷克':[49.8175,15.4730],
    '哥本哈根':[55.6761,12.5683],'丹麥':[56.2639,9.5018],
    '斯德哥爾摩':[59.3293,18.0686],'瑞典':[60.1282,18.6435],
    '奧斯陸':[59.9139,10.7522],'挪威':[60.4720,8.4689],
    '里斯本':[38.7223,-9.1393],'葡萄牙':[39.3999,-8.2245],
    '雅典':[37.9838,23.7275],'希臘':[39.0742,21.8243],
    '伊斯坦堡':[41.0082,28.9784],'土耳其':[38.9637,35.2433],
    '紐約':[40.7128,-74.0060],'美國':[37.0902,-95.7129],
    '多倫多':[43.6532,-79.3832],'加拿大':[56.1304,-106.3468],
    '聖地牙哥':[-33.4489,-70.6693],'智利':[-35.6751,-71.5430],
    '利馬':[-12.0464,-77.0428],'祕魯':[-9.1900,-75.0152],
    '拉巴斯':[-16.5000,-68.1500],'波利維亞':[-16.2902,-63.5887],
    '烏尤尼':[-20.4627,-66.8251],
    '開羅':[30.0444,31.2357],'埃及':[26.8206,30.8025],
    '雪梨':[-33.8688,151.2093],'澳洲':[-25.2744,133.7751]
  };

  function getCoord(name) {
    if (!name) return null;
    if (COORDS[name]) return COORDS[name];
    var keys = Object.keys(COORDS);
    for (var i = 0; i < keys.length; i += 1) {
      if (name.indexOf(keys[i]) >= 0 || keys[i].indexOf(name) >= 0) return COORDS[keys[i]];
    }
    return null;
  }

  var map = L.map('world-map', { scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  var nameToTrips = {};
  getPublishedTrips(TRIPS_DATA).forEach(function (trip) {
    [].concat(trip.cities || []).concat(trip.countries || []).forEach(function (name) {
      if (!nameToTrips[name]) nameToTrips[name] = [];
      if (nameToTrips[name].indexOf(trip) < 0) nameToTrips[name].push(trip);
    });
  });

  var bounds = [];
  var placed = {};
  Object.keys(nameToTrips).forEach(function (name) {
    var coord = getCoord(name);
    if (!coord || placed[name]) return;
    placed[name] = true;
    var trips = nameToTrips[name];
    var marker = L.circleMarker(coord, {
      radius: 7,
      fillColor: '#0284c7',
      color: '#fff',
      weight: 2.5,
      opacity: 1,
      fillOpacity: 0.9
    });
    marker.bindTooltip('<span style="font-size:11px;font-weight:700;font-family:ui-sans-serif,sans-serif">' + name + '</span>', {
      sticky: false,
      direction: 'top',
      offset: [0, -8],
      className: 'lf-label'
    });
    var popup = '<div style="font-family:ui-sans-serif,sans-serif;min-width:140px"><p style="font-size:11px;font-weight:800;color:#0369a1;margin:0 0 5px">' + name + '</p>';
    trips.forEach(function (trip) {
      popup += '<a href="trip.html?id=' + encodeURIComponent(trip.id) + '" style="display:block;font-size:12px;font-weight:600;color:#0f172a;padding:2px 0;border-bottom:1px solid #f1f5f9;text-decoration:none">' + trip.name + '</a>';
    });
    popup += '</div>';
    marker.bindPopup(popup, { maxWidth: 220 });
    marker.addTo(map);
    bounds.push(coord);
  });

  if (bounds.length) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
  else map.setView([20, 10], 2);
})();
