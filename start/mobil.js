/* Handy-Schicht für alle KGÜ-Seiten.
   - Zurück-Knopf zur Übersicht (alle Bildschirme)
   - Auf dem Handy: Bühne auf volle Breite, Text darunter, Knöpfe unten fest.
   Die Seiten rufen window.__mScale(breite, bühnenhöhe) in ihrem fit() auf.
   Gibt 0 zurück = Desktop, dann rechnet die Seite wie immer. */
(function () {
  var root = document.documentElement;
  var PORTRAIT = '(max-width: 760px) and (orientation: portrait)';
  var LANDSCAPE = '(max-height: 500px) and (orientation: landscape)';
  function mode() {
    if (matchMedia(PORTRAIT).matches) return 'hoch';
    if (matchMedia(LANDSCAPE).matches) return 'quer';
    return '';
  }
  function setMode() {
    var m = mode();
    root.classList.toggle('m-hoch', m === 'hoch');
    root.classList.toggle('m-quer', m === 'quer');
    root.classList.toggle('m-handy', !!m);
    return m;
  }
  setMode();

  function h(sel) { var e = document.querySelector(sel); return e ? e.getBoundingClientRect().height : 0; }

  window.__mScale = function (w, stageH) {
    var m = setMode();
    if (!m) return 0;
    if (m === 'hoch') return w / 1000;
    // quer: Bühne so groß wie möglich, unter ihr bleibt Platz für Titel + 2-3 Zeilen Text + Knöpfe
    var top = h('.top') || h('.topline') || 0;
    var ctl = h('.ctl') || h('.ctrl') || 48;
    var rest = window.innerHeight - top - ctl - (document.querySelector('.cap') ? 96 : 10);
    return Math.max(0.3, Math.min(w / 1000, rest / stageH));
  };

  var ARROW = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 L5 8 L10 13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var TURN = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 15 a9 9 0 0 0 7 6.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.2 19.6 L10.3 21.6 L8 23" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function backLink() {
    var a = document.createElement('a');
    a.className = 'm-back';
    a.href = '../index.html';
    a.innerHTML = ARROW + '<span>Übersicht</span>';
    a.setAttribute('aria-label', 'Zurück zur Übersicht');
    a.addEventListener('click', function (e) {
      // kam man von der Übersicht? Dann echtes Zurück, so bleibt die Ansicht wie vorher.
      try {
        var r = document.referrer ? new URL(document.referrer) : null;
        if (r && r.origin === location.origin && /\/(index\.html)?$/.test(r.pathname) && history.length > 1) {
          e.preventDefault(); history.back();
        }
      } catch (_) {}
    });
    return a;
  }

  function init() {
    var bar = document.querySelector('.top, .topline, .hdr');
    if (bar && !bar.querySelector('.m-back')) {
      var first = bar.firstElementChild;
      var grp = document.createElement('span');
      grp.className = 'm-grp';
      bar.insertBefore(grp, first);
      grp.appendChild(backLink());
      if (first) grp.appendChild(first);
    }
    var box = document.querySelector('.stagebox');
    if (box && !document.querySelector('.m-turn')) {
      var t = document.createElement('div');
      t.className = 'm-turn';
      t.innerHTML = TURN + '<span>Handy quer halten: Animation wird größer</span>';
      box.parentNode.insertBefore(t, box.nextSibling);
    }
    // Seiten, deren Erklärtext in der Bühne steht (KGÜ 4 Speicher): Text hochkant groß darunter spiegeln
    var ex = document.getElementById('explain');
    var stage = document.querySelector('.stage');
    if (ex && stage && stage.contains(ex) && !document.querySelector('.m-explain')) {
      var mx = document.createElement('div');
      mx.className = 'm-explain';
      var turn = document.querySelector('.m-turn');
      (turn || box).parentNode.insertBefore(mx, (turn || box).nextSibling);
      var copy = function () { mx.innerHTML = ex.innerHTML; };
      copy();
      new MutationObserver(copy).observe(ex, { childList: true, subtree: true, characterData: true });
    }
    setMode();
    window.dispatchEvent(new Event('resize'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('orientationchange', function () { setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 250); });
  window.addEventListener('load', function () { window.dispatchEvent(new Event('resize')); });
})();
