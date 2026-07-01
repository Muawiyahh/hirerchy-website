// Runs synchronously in <head> before paint so the theme never flashes.
(function () {
  try {
    // CSS default is dark; apply light only when chosen or system-preferred.
    var saved = localStorage.getItem('hirerchy-theme');
    var prefersLight = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches;
    if (saved === 'light' || (!saved && prefersLight)) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) { /* localStorage unavailable — default dark */ }
})();
