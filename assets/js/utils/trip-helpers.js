function tripDetailUrl(trip) {
  if (trip && trip.href && trip.href !== '#' && trip.href.indexOf('trip.html') !== 0) return trip.href;
  return 'trip.html?id=' + encodeURIComponent(trip.id);
}

function getPublishedTrips(list) {
  return (list || []).filter(function (trip) {
    return trip && trip.status === '已發佈';
  });
}

function findTripById(list, id) {
  return (list || []).filter(function (trip) {
    return trip && trip.id === id;
  })[0] || null;
}

function formatDateLabel(value) {
  if (!value) return '';
  var date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.getFullYear() + ' / ' + String(date.getMonth() + 1).padStart(2, '0') + ' / ' + String(date.getDate()).padStart(2, '0');
}

function tripTimeLabel(trip) {
  if (!trip) return '';
  if (trip.start && trip.end && trip.end !== trip.start) {
    return formatDateLabel(trip.start) + ' — ' + formatDateLabel(trip.end);
  }
  if (trip.start) return formatDateLabel(trip.start);
  return trip.year ? String(trip.year) : '';
}
