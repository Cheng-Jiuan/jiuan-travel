(function () {
  renderHomeNavigation(document.getElementById('home-nav-root'));

  var featuredGuidesRoot = document.getElementById('featured-guides');
  if (featuredGuidesRoot && typeof TRIPS_DATA !== 'undefined' && typeof renderTripCardHTML === 'function') {
    var featuredList = getPublishedTrips(TRIPS_DATA).filter(function (trip) {
      return trip.featured;
    });
    featuredGuidesRoot.innerHTML = featuredList.map(renderTripCardHTML).join('');
  }

  function countContinent(key) {
    if (typeof TRIPS_DATA === 'undefined' || typeof tripMatchesContinent !== 'function') return 0;
    return getPublishedTrips(TRIPS_DATA).filter(function (trip) {
      return tripMatchesContinent(trip, key);
    }).length;
  }

  document.querySelectorAll('.continent-trip-count').forEach(function (el) {
    var key = el.getAttribute('data-continent');
    if (!key) return;
    el.textContent = countContinent(key) + ' 趟旅程';
  });

  var section = document.getElementById('explore-world');
  var grid = section && section.querySelector('#explore-continent-grid');
  if (grid && section) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          grid.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
    observer.observe(section);
  }

  var mobileBtn = document.getElementById('mobile-menu-btn');
  var mobilePanel = document.getElementById('mobile-menu-panel');
  var iconOpen = document.getElementById('icon-menu-open');
  var iconClose = document.getElementById('icon-menu-close');

  function setMobileMenu(open) {
    if (!mobilePanel || !mobileBtn) return;
    mobilePanel.classList.toggle('hidden', !open);
    mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileBtn.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }
  }

  if (mobileBtn && mobilePanel) {
    mobileBtn.addEventListener('click', function () {
      setMobileMenu(mobilePanel.classList.contains('hidden'));
    });
    mobilePanel.querySelectorAll('.mobile-nav-jump').forEach(function (link) {
      link.addEventListener('click', function () {
        setMobileMenu(false);
      });
    });
  }

  var backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      backBtn.classList.toggle('is-visible', window.scrollY > 420);
    }, { passive: true });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
