(function () {
  renderSiteHeader(document.getElementById('site-header'), 'journeys');
  renderSiteFooter(document.getElementById('site-footer'), 'journeys');

  if (typeof TRIPS_DATA === 'undefined' || typeof renderTripCardHTML !== 'function') return;

  var publishedTrips = getPublishedTrips(TRIPS_DATA);
  var regionFilter = (new URLSearchParams(location.search).get('continent') || '').trim();

  function uniq(arr) {
    var map = {};
    (arr || []).forEach(function (item) {
      map[item] = true;
    });
    return Object.keys(map).sort();
  }

  function flatRegions() {
    return publishedTrips.reduce(function (acc, trip) {
      return acc.concat(trip.regions || []);
    }, []);
  }

  function availableCountries(region) {
    return publishedTrips
      .filter(function (trip) {
        if (!region) return true;
        if (typeof tripMatchesContinent === 'function' && typeof CONTINENT_LABELS !== 'undefined' && CONTINENT_LABELS[region]) {
          return tripMatchesContinent(trip, region);
        }
        return (trip.regions || []).indexOf(region) !== -1;
      })
      .reduce(function (acc, trip) {
        return acc.concat(trip.countries || []);
      }, []);
  }

  function fillCountrySelect(region) {
    var countrySelect = document.getElementById('f-country');
    var current = countrySelect.value;
    countrySelect.innerHTML = '<option value="">全部</option>';
    uniq(availableCountries(region))
      .sort(function (a, b) { return a.localeCompare(b, 'zh-Hant'); })
      .forEach(function (country) {
        var option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        if (country === current) option.selected = true;
        countrySelect.appendChild(option);
      });
  }

  function fillSelects() {
    var regionSelect = document.getElementById('f-region');
    var yearSelect = document.getElementById('f-year');

    if (typeof CONTINENT_LABELS !== 'undefined') {
      ['asia', 'europe', 'americas', 'africa', 'oceania'].forEach(function (key) {
        if (!publishedTrips.some(function (trip) {
          return typeof tripMatchesContinent === 'function' && tripMatchesContinent(trip, key);
        })) return;
        var option = document.createElement('option');
        option.value = key;
        option.textContent = '── ' + CONTINENT_LABELS[key];
        regionSelect.appendChild(option);
      });
    }

    uniq(flatRegions()).forEach(function (region) {
      var option = document.createElement('option');
      option.value = region;
      option.textContent = '　' + region;
      regionSelect.appendChild(option);
    });

    uniq(publishedTrips.map(function (trip) { return String(trip.year); }))
      .sort(function (a, b) { return parseInt(b, 10) - parseInt(a, 10); })
      .forEach(function (year) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });

    if (regionFilter && Array.prototype.some.call(regionSelect.options, function (option) { return option.value === regionFilter; })) {
      regionSelect.value = regionFilter;
    }

    fillCountrySelect(regionSelect.value);
    regionSelect.addEventListener('change', function () {
      fillCountrySelect(regionSelect.value);
      render();
    });
  }

  function filterTrips() {
    var q = (document.getElementById('q').value || '').trim().toLowerCase();
    var selectedRegion = document.getElementById('f-region').value;
    var selectedCountry = document.getElementById('f-country').value;
    var selectedYear = document.getElementById('f-year').value;

    return publishedTrips.filter(function (trip) {
      if (selectedRegion) {
        var isContinentKey = typeof CONTINENT_LABELS !== 'undefined' && CONTINENT_LABELS[selectedRegion];
        if (isContinentKey) {
          if (typeof tripMatchesContinent === 'function' && !tripMatchesContinent(trip, selectedRegion)) return false;
        } else if ((trip.regions || []).indexOf(selectedRegion) === -1) {
          return false;
        }
      }
      if (selectedCountry && (trip.countries || []).indexOf(selectedCountry) === -1) return false;
      if (selectedYear && String(trip.year) !== selectedYear) return false;
      if (q) {
        var blob = (trip.name + ' ' + trip.summary + ' ' + (trip.countries || []).join(' ') + ' ' + (trip.cities || []).join(' ')).toLowerCase();
        if (blob.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function render() {
    var list = filterTrips();
    document.getElementById('result-count').textContent = '共 ' + list.length + ' 篇' + (list.length !== publishedTrips.length ? '（已篩選）' : '');
    document.getElementById('journey-grid').innerHTML = list.map(renderTripCardHTML).join('');
  }

  fillSelects();

  if (regionFilter && typeof CONTINENT_LABELS !== 'undefined' && CONTINENT_LABELS[regionFilter]) {
    var note = document.createElement('p');
    note.id = 'continent-banner';
    note.className = 'mb-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800';
    note.textContent = '已依「' + CONTINENT_LABELS[regionFilter] + '」篩選旅程。按重設可看全部。';
    document.querySelector('main').insertBefore(note, document.querySelector('main').firstChild);
  }

  var preCountry = new URLSearchParams(location.search).get('country');
  if (preCountry) {
    var countrySelect = document.getElementById('f-country');
    if (countrySelect) {
      if (Array.prototype.some.call(countrySelect.options, function (option) { return option.value === preCountry; })) {
        countrySelect.value = preCountry;
      } else {
        var ghost = document.createElement('option');
        ghost.value = preCountry;
        ghost.textContent = preCountry + '（尚未收錄）';
        countrySelect.appendChild(ghost);
        countrySelect.value = preCountry;
      }
    }
  }

  ['q', 'f-country', 'f-year'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    document.getElementById('q').value = '';
    document.getElementById('f-region').value = '';
    fillCountrySelect('');
    document.getElementById('f-country').value = '';
    document.getElementById('f-year').value = '';
    regionFilter = '';
    var banner = document.getElementById('continent-banner');
    if (banner) banner.remove();
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, '', 'journeys.html');
    }
    render();
  });

  render();
})();
