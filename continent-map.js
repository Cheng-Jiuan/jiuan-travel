/**
 * 將 trips-data.js 的「區域」（regions，如東北亞、南美）對應到五大洲 key。
 * key：asia、europe、africa、americas、oceania
 */
(function (global) {
  var REGION_TO_CONTINENT = {
    東北亞: 'asia',
    東南亞: 'asia',
    東亞: 'asia',
    南亞: 'asia',
    西亞: 'asia',
    中亞: 'asia',
    北歐: 'europe',
    南歐: 'europe',
    中歐: 'europe',
    東歐: 'europe',
    西歐: 'europe',
    北美: 'americas',
    南美: 'americas',
    中美: 'americas',
    加勒比: 'americas',
    北非: 'africa',
    東非: 'africa',
    南非: 'africa',
    西非: 'africa',
    中非: 'africa',
    非洲: 'africa',
    大洋洲: 'oceania',
    澳洲: 'oceania',
    紐西蘭: 'oceania',
  };

  var CONTINENT_LABELS = {
    asia: '亞洲',
    europe: '歐洲',
    africa: '非洲',
    americas: '美洲',
    oceania: '大洋洲',
  };

  function regionToContinentKey(r) {
    if (!r) return null;
    return REGION_TO_CONTINENT[r] || null;
  }

  /** 一筆旅程可能跨多區，回傳不重複的洲別 key */
  function continentsForTrip(t) {
    var set = {};
    (t.regions || []).forEach(function (r) {
      var k = regionToContinentKey(r);
      if (k) set[k] = true;
    });
    return Object.keys(set);
  }

  function tripMatchesContinent(t, key) {
    if (!key) return true;
    return continentsForTrip(t).indexOf(key) !== -1;
  }

  global.REGION_TO_CONTINENT = REGION_TO_CONTINENT;
  global.CONTINENT_LABELS = CONTINENT_LABELS;
  global.regionToContinentKey = regionToContinentKey;
  global.continentsForTrip = continentsForTrip;
  global.tripMatchesContinent = tripMatchesContinent;
})(typeof window !== 'undefined' ? window : this);
