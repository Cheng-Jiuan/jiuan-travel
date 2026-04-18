function renderTripCardHTML(trip) {
  var href = escapeHtml(tripDetailUrl(trip));
  var name = escapeHtml(trip.name);
  var summary = escapeHtml(trip.summary);
  var image = escapeHtml(resolveImagePath(trip.image));
  var tag = escapeHtml(trip.tag);

  return (
    '<a href="' + href + '" class="group block rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all">' +
      '<div class="aspect-[3/2] overflow-hidden bg-gray-100">' +
        '<img src="' + image + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">' +
      '</div>' +
      '<div class="p-6">' +
        '<h3 class="font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">' + name + '</h3>' +
        '<p class="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">' + summary + '</p>' +
        '<div class="mt-4 flex gap-2"><span class="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold">#' + tag + '</span></div>' +
      '</div>' +
    '</a>'
  );
}
