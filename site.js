// Small extra shared by every page. Everything else (reveals, project switcher,
// book viewer, Let's talk button, pattern strip) runs inside each page itself.
// Fiamma portal: a small flickering ember, always on screen (bottom left),
// that opens the Fiamma presentation at /fiamma/.
(function () {
  if (/^\/fiamma/.test(location.pathname)) return;
  var css = document.createElement('style');
  css.textContent =
    '.ember-portal{position:fixed;left:6px;bottom:6px;z-index:9999;width:46px;height:46px;display:grid;place-items:center;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.ember-portal i{width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 45% 40%,#fff3d6,#ffb35c 35%,#ff4a1c 70%);' +
      'box-shadow:0 0 8px 2px rgba(255,120,40,.9),0 0 24px 6px rgba(255,74,28,.55),0 0 46px 10px rgba(255,42,42,.25);animation:emberFlicker 3.4s infinite,emberFloat 6s ease-in-out infinite;transition:transform .5s cubic-bezier(.2,.7,.2,1)}' +
    '.ember-portal span{position:absolute;left:14px;bottom:62px;white-space:nowrap;font:500 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#ff4a1c;opacity:0;transform:translateY(6px);transition:opacity .5s,transform .5s;pointer-events:none}' +
    '.ember-portal:hover i,.ember-portal:focus-visible i{transform:scale(1.45)}' +
    '.ember-portal:hover span,.ember-portal:focus-visible span{opacity:1;transform:none}' +
    '@keyframes emberFlicker{0%,100%{opacity:1;filter:brightness(1)}8%{opacity:.82}10%{opacity:1;filter:brightness(1.25)}34%{opacity:.9;filter:brightness(.9)}36%{opacity:1}61%{filter:brightness(1.15)}63%{opacity:.75}65%{opacity:1}80%{filter:brightness(.95)}}' +
    '@keyframes emberFloat{0%,100%{translate:0 0}50%{translate:0 -4px}}' +
    '.ember-wash{position:fixed;inset:0;z-index:10000;pointer-events:none;background:radial-gradient(circle at 29px calc(100% - 29px),#ff4a1c,#3a0b05 45%,#0b0706 80%);clip-path:circle(0 at 29px calc(100% - 29px));transition:clip-path 1.1s cubic-bezier(.6,.05,.3,1)}' +
    '.ember-wash.go{clip-path:circle(150% at 29px calc(100% - 29px))}' +
    '@media (prefers-reduced-motion: reduce){.ember-portal i{animation:none}}';
  document.head.appendChild(css);
  function add() {
    var a = document.createElement('a');
    a.className = 'ember-portal'; a.href = '/fiamma/'; a.setAttribute('aria-label', 'Open the Fiamma presentation');
    a.innerHTML = '<i></i><span>Fiamma →</span>';
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var w = document.createElement('div'); w.className = 'ember-wash'; document.body.appendChild(w);
      requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add('go'); }); });
      setTimeout(function () { location.href = '/fiamma/'; }, 1000);
    });
    document.body.appendChild(a);
  }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  // Coming back with the browser's back button: clear the glow wash
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.ember-wash').forEach(function (w) { w.remove(); });
  });
})();

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Gentle 3D tilt on gallery cards (mouse only, skipped when motion is off)
  var MAX_TILT = 6; // degrees, raise for more tilt
  if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var SEL = '.card .card-img, .tile';
  document.addEventListener('mousemove', function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    if (!el) return;
    var r = el.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = 'perspective(800px) rotateX(' + (-y * MAX_TILT) + 'deg) rotateY(' + (x * MAX_TILT) + 'deg)';
  });
  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest && e.target.closest(SEL);
    if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
  });
})();

// Page switch: a color wash grows from the click point, then the next page fades it away.
// Colors follow the menu (Contact pink, Resume teal, Portfolios indigo, Process orange).
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAL = ['#ED217C', '#13A89E', '#7D8AD0', '#F26A21'];
  var BY = { contact: '#ED217C', resume: '#13A89E', portfolios: '#7D8AD0', process: '#F26A21' };
  function colorFor(path) {
    var n = (path.split('/').pop() || 'index').replace('.html', '') || 'index';
    if (BY[n]) return BY[n];
    var h = 0; for (var i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
    return PAL[h % PAL.length];
  }
  document.addEventListener('click', function (e) {
    if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.classList.contains('ember-portal')) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin || /^\/fiamma/.test(u.pathname) || /\.(pdf|png|jpe?g|webp|zip)$/i.test(u.pathname)) return;
    if (u.pathname === location.pathname) return; // same page (anchors, back to top)
    e.preventDefault();
    var c = colorFor(u.pathname), x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
    try { sessionStorage.setItem('skWash', c); } catch (err) {}
    var w = document.createElement('div'); w.className = 'sk-wash';
    w.style.setProperty('--sk-wash', c); w.style.setProperty('--sk-x', x + 'px'); w.style.setProperty('--sk-y', y + 'px');
    document.body.appendChild(w);
    requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add('go'); }); });
    setTimeout(function () { location.href = u.href; }, 620);
  });
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.sk-wash').forEach(function (w) { w.remove(); });
  });
})();

// First visit loader: waits for fonts and the images on screen, then fades away.
// At least 1 second (so it never flashes), never more than 5 (slow connections).
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('sk-load')) return;
  var MIN = 1000, MAX = 5000, t0 = Date.now(), done = false;
  function build() {
    var el = document.createElement('div'); el.className = 'sk-loader'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="in"><img src="img/sk-logo.png" alt=""><div class="bar"><i></i></div></div>';
    document.body.appendChild(el);
    var bar = el.querySelector('.bar i');
    function setP(p) { bar.style.setProperty('--p', Math.max(.04, Math.min(1, p))); }
    function finish() {
      if (done) return; done = true; setP(1);
      setTimeout(function () {
        el.classList.add('done'); root.classList.remove('sk-load');
        setTimeout(function () { el.remove(); }, 800);
      }, Math.max(350, MIN - (Date.now() - t0)));
    }
    setTimeout(finish, MAX);
    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    function onScreenImages() {
      return Array.prototype.filter.call(document.images, function (im) {
        if (im.closest('.sk-loader')) return false;
        var r = im.getBoundingClientRect();
        return r.top < innerHeight * 1.5 && r.bottom > -10 && r.width > 0;
      });
    }
    function waitImages() {
      var ims = onScreenImages(), total = ims.length || 1, n = 0;
      if (!ims.length) return Promise.resolve();
      return Promise.all(ims.map(function (im) {
        var p = (im.complete && im.naturalWidth) ? Promise.resolve() : new Promise(function (res) {
          im.addEventListener('load', res, { once: true }); im.addEventListener('error', res, { once: true });
          if (im.loading === 'lazy') im.loading = 'eager';
        });
        return p.then(function () { n++; setP(.2 + .75 * n / total); });
      }));
    }
    function loaded() { return document.readyState === 'complete' ? Promise.resolve() : new Promise(function (r) { addEventListener('load', r, { once: true }); }); }
    setP(.12);
    loaded().then(function () { setP(.2); return new Promise(function (r) { setTimeout(r, 120); }); })
      .then(function () { return Promise.all([fonts, waitImages()]); })
      .then(finish, finish);
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
