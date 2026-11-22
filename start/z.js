// Anonyme Besuchszählung: keine Cookies, keine IP-Adresse gespeichert. Läuft nur auf der Website, nicht im Zip.
// Eigenes Gerät ausnehmen: Seite einmal mit ?ich=1 öffnen (wieder zählen: ?ich=0).
(function () {
  if (location.protocol !== 'https:' || !/bariskaandatli\.com$/.test(location.hostname)) return;
  try {
    if (/[?&]ich=1/.test(location.search)) localStorage.setItem('nz', '1');
    if (/[?&]ich=0/.test(location.search)) localStorage.removeItem('nz');
    if (localStorage.getItem('nz')) return;
  } catch (e) {}
  var U = 'https://z.bariskaandatli.com/e', ref = '';
  try { var h = new URL(document.referrer).hostname; if (h !== location.hostname) ref = h; } catch (e) {}
  function send(t, n) {
    var b = JSON.stringify({ t: t, p: location.pathname, n: String(n || '').replace(/[^\w\-.:\/ äöüÄÖÜß]/g, '').slice(0, 60), r: ref, w: innerWidth });
    try { if (!navigator.sendBeacon || !navigator.sendBeacon(U, b)) fetch(U, { method: 'POST', body: b, keepalive: true, mode: 'no-cors' }); } catch (e) {}
  }
  window.zc = function (n) { send('click', n); };
  send('view');
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if (!t.closest) return;
    if ((el = t.closest('[data-z]'))) send('click', el.getAttribute('data-z'));
    else if ((el = t.closest('.kg button'))) send('click', 'kgue:' + el.textContent.trim().charAt(0));
    else if ((el = t.closest('.switch button'))) send('click', 'ansicht:' + el.textContent.trim());
    else if ((el = t.closest('.klinks a'))) send('click', 'karte:' + el.getAttribute('href'));
  }, true);
})();
