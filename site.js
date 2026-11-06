// Small extra shared by every page. Everything else (reveals, project switcher,
// book viewer, Let's talk button, pattern strip) runs inside each page itself.
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
