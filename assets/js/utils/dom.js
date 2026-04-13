function escapeHtml(value) {
  if (value == null) return '';
  var div = document.createElement('div');
  div.textContent = String(value);
  return div.innerHTML;
}

function richText(value) {
  return value == null ? '' : String(value);
}
