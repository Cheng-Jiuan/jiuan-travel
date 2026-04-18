function renderTripCardHTML(trip) {
  var href = escapeHtml(tripDetailUrl(trip));
  var name = escapeHtml(trip.name);
  var summary = escapeHtml(trip.summary);
  var image = escapeHtml(resolveImagePath(trip.image));
  var tag = escapeHtml(trip.tag);

  return (
    '<a href="' + href + '" class="group panel-card block overflow-hidden rounded-[1.7rem] transition-all hover:-translate-y-1 hover:border-[rgba(49,74,80,0.16)] hover:shadow-[0_22px_40px_-28px_rgba(34,50,56,0.15)]">' +
      '<div class="aspect-[4/3] overflow-hidden bg-[rgba(238,243,242,0.8)]">' +
        '<img src="' + image + '" alt="" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy">' +
      '</div>' +
      '<div class="p-6">' +
        '<h3 class="display-serif mb-2 text-[1.24rem] font-bold leading-[1.3] text-[var(--ink)] transition-colors group-hover:text-[var(--sea-deep)]">' + name + '</h3>' +
        '<p class="text-[14px] leading-7 text-[var(--muted)]">' + summary + '</p>' +
        '<div class="mt-4 flex gap-2"><span class="chip-soft text-[0.7rem]">#' + tag + '</span></div>' +
      '</div>' +
    '</a>'
  );
}
