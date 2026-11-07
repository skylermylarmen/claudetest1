// Small extra shared by every page. Everything else (reveals, project switcher,
// book viewer, Let's talk button, pattern strip) runs inside each page itself.
// Fiamma portal: a small flickering ember, always on screen (bottom left),
// that opens the Fiamma presentation at /fiamma/.
(function () {
  if (/^\/fiamma/.test(location.pathname)) return;
  var css = document.createElement('style');
  css.textContent =
    '.ember-portal{position:fixed;left:6px;bottom:6px;z-index:9999;width:46px;height:46px;display:grid;place-items:center;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.ember-portal{transition:opacity .35s}.ember-portal.ember-hide{opacity:0;pointer-events:none}' +
    '.ember-portal i{position:relative;display:block;width:14px;height:14px;animation:emberFlicker 3.4s infinite,emberFloat 6s ease-in-out infinite;transition:transform .5s cubic-bezier(.2,.7,.2,1)}' +
    '.ember-portal i svg{position:absolute;left:-5px;top:-5px;width:24px;height:24px;overflow:visible;filter:drop-shadow(0 0 4px rgba(255,120,40,.95)) drop-shadow(0 0 12px rgba(255,74,28,.6)) drop-shadow(0 0 22px rgba(255,42,42,.3))}' +
    '.ember-portal span{position:absolute;left:14px;bottom:62px;white-space:nowrap;font:500 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#ff4a1c;opacity:0;transform:translateY(6px);transition:opacity .5s,transform .5s;pointer-events:none}' +
    '.ember-portal:hover i,.ember-portal:focus-visible i{transform:scale(1.45)}' +
    '.ember-portal:hover span,.ember-portal:focus-visible span{opacity:1;transform:none}' +
    '@keyframes emberFlicker{0%,100%{opacity:1;filter:brightness(1)}8%{opacity:.82}10%{opacity:1;filter:brightness(1.25)}34%{opacity:.9;filter:brightness(.9)}36%{opacity:1}61%{filter:brightness(1.15)}63%{opacity:.75}65%{opacity:1}80%{filter:brightness(.95)}}' +
    '@keyframes emberFloat{0%,100%{translate:0 0}50%{translate:0 -4px}}' +
    '.ember-wash{position:fixed;inset:0;z-index:10000;pointer-events:none;background:radial-gradient(circle at 29px calc(100% - 29px),#ff4a1c,#3a0b05 45%,#0b0706 80%);clip-path:circle(0 at 29px calc(100% - 29px));transition:clip-path 1.1s cubic-bezier(.6,.05,.3,1)}' +
    '.ember-wash.go{clip-path:circle(150% at 29px calc(100% - 29px))}' +
    '@media (prefers-reduced-motion: reduce){.ember-portal i{animation:none}}';
  document.head.appendChild(css);
  // Circle <-> 4-point ember star, a gentle 18s loop (2x the 9s Let's talk beat),
  // and it fades out at the page bottom exactly when Let's talk does.
  function morph(a) {
    var P = a.querySelector('#emp');
    var C = [0,-22,12.15,-22,22,-12.15,22,0,22,12.15,12.15,22,0,22,-12.15,22,-22,12.15,-22,0,-22,-12.15,-12.15,-22,0,-22];
    var S = [0,-27,2,-8,8,-2,27,0,8,2,2,8,0,27,-2,8,-8,2,-27,0,-8,-2,-2,-8,0,-27];
    function ease(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
    function shape(k) {
      var p = []; for (var i = 0; i < C.length; i++) p.push((C[i] + (S[i] - C[i]) * k).toFixed(2));
      var o = 'M' + p[0] + ' ' + p[1];
      for (var q = 0; q < 4; q++) { var b = 2 + q*6; o += 'C' + p[b] + ' ' + p[b+1] + ' ' + p[b+2] + ' ' + p[b+3] + ' ' + p[b+4] + ' ' + p[b+5]; }
      return o + 'Z';
    }
    // rests as a circle; every 18s it springs to the star and back a few times, each flash softer, then settles
    function k(t) { if (t < .55 || t > .8) return 0; var u = (t - .55) / .25; return Math.pow(1 - u, 1.1) * .5 * (1 - Math.cos(u * Math.PI * 2 * 3)); }
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    P.setAttribute('d', shape(0));
    if (!reduce) (function frame() { P.setAttribute('d', shape(k((Date.now() % 18000) / 18000))); requestAnimationFrame(frame); })();
    function u() {
      var d = document.documentElement, y = window.pageYOffset || d.scrollTop || 0;
      a.classList.toggle('ember-hide', (window.innerHeight + y) >= (Math.max(d.scrollHeight, document.body.scrollHeight) - 120));
    }
    window.addEventListener('scroll', u, { passive: true }); window.addEventListener('resize', u); setInterval(u, 200); u();
  }
  function add() {
    var a = document.createElement('a');
    a.className = 'ember-portal'; a.href = '/fiamma/'; a.setAttribute('aria-label', 'Open the Fiamma presentation');
    a.innerHTML = '<i><svg viewBox="-34 -34 68 68" aria-hidden="true"><defs><radialGradient id="emg" cx="45%" cy="40%" r="62%"><stop offset="0" stop-color="#fff3d6"/><stop offset=".35" stop-color="#ffb35c"/><stop offset=".7" stop-color="#ff4a1c"/></radialGradient></defs><path id="emp" fill="url(#emg)" d=""/></svg></i><span>Fiamma →</span>';
    morph(a);
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

// Page switch: a simple fade. The page fades out, then the next page fades in.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.classList.contains('ember-portal')) return;
    var u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin || /^\/fiamma/.test(u.pathname) || /\.(pdf|png|jpe?g|webp|zip)$/i.test(u.pathname)) return;
    if (u.pathname === location.pathname) return; // same page (anchors, back to top)
    e.preventDefault();
    document.documentElement.classList.add('sk-leaving');
    setTimeout(function () { location.href = u.href; }, 280);
  });
  window.addEventListener('pageshow', function () { document.documentElement.classList.remove('sk-leaving'); });
})();

// First visit loader: waits for fonts and the images on screen, then fades away.
// At least 1 second (so it never flashes), never more than 5 (slow connections).
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('sk-load')) return;
  // BAR = the shortest time the bar takes to fill, so it always visibly sweeps across
  // (even when everything is cached). MAX = give up waiting on slow connections.
  var BAR = 1900, HOLD = 350, MAX = 4000, t0 = 0, done = false, real = 0, shown = 0, closing = false;
  function build() {
    var el = document.createElement('div'); el.className = 'sk-loader'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="in"><img src="img/sk-logo.png" alt=""><div class="bar"><i></i></div></div>';
    document.body.appendChild(el);
    var bar = el.querySelector('.bar i');
    bar.style.transition = 'none';
    t0 = performance.now();
    // real loading progress only ever holds the bar back; time sets the pace
    function setP(p) { real = Math.max(real, Math.min(1, p)); }
    function ease(x) { return 1 - Math.pow(1 - x, 3); }
    function tick(now) {
      var timeP = ease(Math.min(1, (now - t0) / BAR));
      var cap = done ? 1 : Math.min(.92, .15 + real * .8);
      var target = Math.min(timeP, cap);
      shown += (Math.max(shown, target) - shown) * .22;
      if (target - shown < .002) shown = target;
      bar.style.setProperty('--p', Math.max(.02, shown));
      if (done && shown >= .999) { if (!closing) { closing = true; setTimeout(close, HOLD); } return; }
      requestAnimationFrame(tick);
    }
    function close() {
      el.classList.add('done'); root.classList.remove('sk-load');
      setTimeout(function () { el.remove(); }, 800);
    }
    function finish() { if (done) return; done = true; setP(1); }
    requestAnimationFrame(tick);
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
// Rip protection (deterrent): blocks right-click, dragging media, copying and save/view-source shortcuts.
// Contact details (email/phone links) and form fields can still be selected and copied.
(function () {
  var OK = 'input, textarea, [contenteditable], a[href^="mailto"], a[href^="tel"]';
  function ok(n) { return n && n.closest && n.closest(OK); }
  document.addEventListener('contextmenu', function (e) { if (!ok(e.target)) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { if (e.target && /^(IMG|VIDEO|SVG|CANVAS|A)$/i.test(e.target.nodeName || '')) e.preventDefault(); });
  ['copy', 'cut'].forEach(function (t) {
    document.addEventListener(t, function (e) {
      var s = window.getSelection && window.getSelection(), n = s && s.anchorNode;
      if (n && n.nodeType === 3) n = n.parentNode;
      if (!ok(n) && !ok(document.activeElement)) e.preventDefault();
    });
  });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.metaKey || e.ctrlKey) && (k === 's' || k === 'u' || k === 'p')) e.preventDefault();
  });
})();

// Fit headings: on narrow screens a long word (e.g. "VISUALIZATIONS") would either overflow or split
// mid-word. This shrinks just that heading until its longest word fits on one line. Never grows text.
(function () {
  var SEL = 'h1, h2, h3, h4, .hp, .h', MIN = 0.5, style = document.createElement('style'), n = 0;
  document.head.appendChild(style);
  function overflow(el) {
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== 'inline') return el.scrollWidth / el.clientWidth;
    var r = el.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    if (r.right > vw - 8 && r.width > 0) return r.width / Math.max(40, r.width - (r.right - (vw - 8)));
    return 0;
  }
  function fit() {
    style.textContent = '';
    var rules = [];
    document.querySelectorAll(SEL).forEach(function (el) {
      if (el.closest('.sk-loader, .menu, .tb, .lt') || !el.offsetParent) return;
      var o = overflow(el);
      if (!o || o <= 1) return;
      var fs = parseFloat(getComputedStyle(el).fontSize), k = el.getAttribute('data-fit') || (el.setAttribute('data-fit', ++n), n);
      var size = Math.max(fs * MIN, fs / o * 0.97);
      rules.push('html body [data-fit][data-fit="' + k + '"]{font-size:' + size.toFixed(1) + 'px!important}');
    });
    style.textContent = rules.join('');
    // a second pass catches headings whose line-wrapping changed after the first shrink
    requestAnimationFrame(function () {
      var more = [];
      document.querySelectorAll('[data-fit]').forEach(function (el) {
        var o = overflow(el); if (o > 1) {
          var fs = parseFloat(getComputedStyle(el).fontSize);
          more.push('html body [data-fit][data-fit="' + el.getAttribute('data-fit') + '"]{font-size:' + Math.max(8, fs / o * 0.97).toFixed(1) + 'px!important}');
        }
      });
      if (more.length) style.textContent += more.join('');
    });
  }
  var t; function later() { clearTimeout(t); t = setTimeout(fit, 120); }
  addEventListener('resize', later);
  addEventListener('load', later);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
  setTimeout(fit, 600); setTimeout(fit, 2000);
})();
