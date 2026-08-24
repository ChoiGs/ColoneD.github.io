/*!
 * 최광선 — Personal site
 * 테마 토글 · 스크롤 스파이 · 등장 애니메이션 · 맨 위로
 * 의존성 없음.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------- 테마 -- */
  var toggle = document.getElementById('themeToggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0b0d10' : '#ffffff');
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
      toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  function storedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  applyTheme(root.dataset.theme || 'light');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* 프라이빗 모드 등 */ }
    });
  }

  // 직접 고른 적이 없다면 OS 설정 변경을 따라간다
  var onSystemChange = function (e) {
    if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
  };
  if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
  else if (systemDark.addListener) systemDark.addListener(onSystemChange);

  /* ------------------------------------------ 헤더 · 스크롤 스파이 · FAB -- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function headerHeight() {
    return header ? header.offsetHeight : 64;
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 400);

    if (!sections.length) return;

    var probe = y + headerHeight() + 24;
    var atBottom = (y + window.innerHeight) >= (document.body.scrollHeight - 4);
    var active = null;

    if (atBottom) {
      active = sections[sections.length - 1];
    } else {
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= probe) active = sections[i];
      }
    }

    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', active !== null && a.getAttribute('href') === '#' + active.id);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* --------------------------------------------------- 등장 애니메이션 -- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

    revealables.forEach(function (el) {
      // 같은 부모 안의 카드들만 시차를 둔다 (섹션 간에는 지연 없음)
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (n) {
        return n.classList && n.classList.contains('reveal');
      });
      var order = siblings.indexOf(el);
      if (order > 0) el.style.transitionDelay = (Math.min(order, 4) * 70) + 'ms';
      io.observe(el);
    });
  }
})();
