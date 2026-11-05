// Small bits of interactivity shared by every page.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Reveal-on-scroll (Process page steps and cards, anything with class "rv")
  var rv = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    rv.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.remove('rv-in'); io.observe(el); }
      else el.classList.add('rv-in');
    });
  } else {
    rv.forEach(function (el) { el.classList.add('rv-in'); });
  }

  // 2. "Click to switch project" menu on project pages
  var menu = document.querySelector('.menu[data-switch]');
  if (menu) {
    var btns = document.querySelectorAll('.switch button[aria-haspopup]');
    var set = function (open) {
      menu.hidden = !open;
      btns.forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); });
    });
    document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  // 3. Gentle 3D tilt on gallery cards (mouse only, skipped when motion is off)
  var MAX_TILT = 6; // degrees, raise for more tilt
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card .card-img, .tile').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateX(' + (-y * MAX_TILT) + 'deg) rotateY(' + (x * MAX_TILT) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }
})();
