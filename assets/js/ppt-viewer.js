/**
 * PPT 弹窗翻页预览器
 * 用法：
 *   PPTViewer.open({
 *     title: '案例标题',
 *     pages: ['assets/ppt/xxx/01.jpg', 'assets/ppt/xxx/02.jpg', ...]
 *   });
 *
 * 后续如要支持 PDF，可扩展 options.pdf 字段（基于 PDF.js）。
 */
(function () {
  var current = null;
  var els = {};
  var pageIndex = 0;
  var pages = [];
  var title = '';

  function build() {
    if (els.root) return;
    var root = document.createElement('div');
    root.className = 'ppt-viewer';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.innerHTML =
      '<div class="ppt-mask" data-ppt-close></div>' +
      '<div class="ppt-stage">' +
        '<header class="ppt-bar">' +
          '<div class="ppt-title">' +
            '<span class="ppt-label">CASE PREVIEW</span>' +
            '<span class="ppt-name"></span>' +
          '</div>' +
          '<div class="ppt-tools">' +
            '<span class="ppt-page-indicator"><b class="ppt-cur">1</b> / <span class="ppt-total">1</span></span>' +
            '<button class="ppt-icon" data-ppt-action="prev" aria-label="上一页">‹</button>' +
            '<button class="ppt-icon" data-ppt-action="next" aria-label="下一页">›</button>' +
            '<button class="ppt-icon ppt-close" data-ppt-action="close" aria-label="关闭">×</button>' +
          '</div>' +
        '</header>' +
        '<div class="ppt-canvas">' +
          '<button class="ppt-nav ppt-nav-prev" data-ppt-action="prev" aria-label="上一页">‹</button>' +
          '<button class="ppt-nav ppt-nav-next" data-ppt-action="next" aria-label="下一页">›</button>' +
          '<div class="ppt-page-wrap">' +
            '<img class="ppt-page" alt="" />' +
            '<div class="ppt-loading">加载中…</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    els = {
      root: root,
      stage: root.querySelector('.ppt-stage'),
      name: root.querySelector('.ppt-name'),
      cur: root.querySelector('.ppt-cur'),
      total: root.querySelector('.ppt-total'),
      img: root.querySelector('.ppt-page'),
      loading: root.querySelector('.ppt-loading'),
      pageWrap: root.querySelector('.ppt-page-wrap'),
    };
    root.addEventListener('click', onClick);
  }

  function onClick(e) {
    var t = e.target.closest('[data-ppt-action],[data-ppt-close]');
    if (!t) return;
    var action = t.getAttribute('data-ppt-action') || 'close';
    if (action === 'prev') prev();
    else if (action === 'next') next();
    else if (action === 'close' || t.hasAttribute('data-ppt-close')) close();
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  }

  function render() {
    if (!pages.length) return;
    pageIndex = Math.max(0, Math.min(pageIndex, pages.length - 1));
    var src = pages[pageIndex];
    els.img.classList.remove('is-loaded');
    els.loading.style.display = 'flex';
    els.img.onload = function () {
      els.img.classList.add('is-loaded');
      els.loading.style.display = 'none';
    };
    els.img.onerror = function () {
      els.loading.textContent = '这一页加载失败';
      els.loading.style.display = 'flex';
    };
    els.img.src = src;
    els.cur.textContent = String(pageIndex + 1);
    els.total.textContent = String(pages.length);
    els.root.querySelectorAll('.ppt-nav').forEach(function (b) {
      var a = b.getAttribute('data-ppt-action');
      if (a === 'prev') b.disabled = pageIndex === 0;
      if (a === 'next') b.disabled = pageIndex === pages.length - 1;
    });
  }

  function open(opts) {
    build();
    title = opts && opts.title ? opts.title : '案例预览';
    pages = (opts && opts.pages) || [];
    if (!pages.length) return;
    pageIndex = 0;
    els.name.textContent = title;
    els.root.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    render();
  }

  function close() {
    if (!els.root) return;
    els.root.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    els.img.removeAttribute('src');
  }

  function next() { if (pageIndex < pages.length - 1) { pageIndex++; render(); } }
  function prev() { if (pageIndex > 0) { pageIndex--; render(); } }

  // 简单触摸滑动
  var touchStartX = 0;
  function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
  function onTouchEnd(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next(); else prev();
    }
  }

  function bindTouch() {
    if (!els.stage) return;
    els.stage.addEventListener('touchstart', onTouchStart, { passive: true });
    els.stage.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  // 启动时绑定一次触摸（DOM 已存在之后）
  document.addEventListener('DOMContentLoaded', function () {
    // 不预创建，等 open() 时再创建；这里仅占位
  });

  window.PPTViewer = { open: open, close: close };
})();