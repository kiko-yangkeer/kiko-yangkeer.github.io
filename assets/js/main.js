(function () {
  var D = window.SITE_DATA || {};
  var page = document.body.getAttribute('data-page') || 'index';
  var root = document.getElementById('root');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(s) {
    return esc(s).replace(/\[X[^\]]*\]/g, function (m) {
      return '<span class="pending" title="数据待补充">' + m + '</span>';
    });
  }

  var NAV = [
    ['index.html', '首页'],
    ['about.html', '关于我'],
    ['experience.html', '经历'],
    ['portfolio.html', '案例'],
    ['skills.html', '技能'],
    ['contact.html', '联系']
  ];
  var ACTIVE = { index: 'index.html', about: 'about.html', experience: 'experience.html', portfolio: 'portfolio.html', case: 'portfolio.html', skills: 'skills.html', contact: 'contact.html' };

  function renderHeader() {
    var h = document.getElementById('site-header');
    var links = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[0] === ACTIVE[page] ? ' class="active"' : '') + '>' + n[1] + '</a>';
    }).join('');
    h.innerHTML = '<div class="header-inner"><a class="brand" href="index.html">' + esc(D.name) + '<span>' + esc(D.nickname) + '</span></a><nav class="nav">' + links + '</nav></div>';
  }

  function renderFooter() {
    document.getElementById('site-footer').innerHTML =
      '<div class="container"><p>© 2026 ' + esc(D.name) + ' · 用数据与内容，创造增长</p>' +
      '<p class="foot-sub">' + esc(D.location) + ' · ' + esc(D.email) + '</p></div>';
  }

  function sectionHead(title, moreHref, moreText) {
    return '<div class="sec-head"><h2>' + title + '</h2>' +
      (moreHref ? '<a class="more" href="' + moreHref + '">' + moreText + ' →</a>' : '') + '</div>';
  }

  function metricTags(arr) {
    return '<div class="card-meta">' + arr.map(function (m) { return '<span class="metric">' + fmt(m) + '</span>'; }).join('') + '</div>';
  }

  function expBlock(e, detailed) {
    var body = '<div class="tl-body"><h3>' + esc(e.company) + '</h3>' +
      '<div class="tl-role">' + esc(e.role) + '</div>' +
      '<p class="tl-summary">' + esc(e.summary) + '</p>';
    if (detailed) {
      body += '<ul class="tl-points">' + e.points.map(function (p) { return '<li>' + fmt(p) + '</li>'; }).join('') + '</ul>';
    } else {
      body += '<div class="tl-highlight">' + fmt(e.highlight) + '</div>';
    }
    return '<div class="tl-item reveal"><div class="tl-period">' + esc(e.period) + '</div>' + body + '</div></div>';
  }

  function portfolioCard(c) {
    var preview = c.previewKey && D.previews && D.previews[c.previewKey];
    var hasPreview = !c.noPreview && preview && preview.pages && preview.pages.length;
    var actionsHtml;
    if (c.noPreview) {
      actionsHtml = '<div class="card-actions"><span class="preview-hint-inline">聚焦思路与流程的完整复盘 →</span></div>';
    } else {
      var btn = hasPreview
        ? '<button class="preview-btn" data-preview="' + esc(c.previewKey) + '">预览 PPT <span class="arrow">→</span></button>'
        : '<button class="preview-btn preview-btn-pending" disabled>PPT 整理中</button>';
      actionsHtml = '<div class="card-actions">' + btn + '</div>';
    }
    return '<div class="card reveal">' +
      '<a class="card-body" href="' + c.href + '">' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<div class="card-org">' + esc(c.org) + '</div>' +
        '<p>' + esc(c.summary) + '</p>' +
        metricTags(c.metrics) +
      '</a>' +
      actionsHtml +
    '</div>';
  }

  function pendingCard() {
    return '<div class="card card-pending reveal"><div class="plus">+</div><h3>更多案例整理中</h3><p>正在沉淀新的项目案例，敬请期待</p></div>';
  }

  function profileChips() {
    var list = [D.zodiac, D.mbti].concat(D.profileTags || []);
    return '<div class="card-meta" style="margin-top:16px;">' +
      list.map(function (t) { return '<span class="metric">' + esc(t) + '</span>'; }).join('') +
      '</div>';
  }

  function renderIndex() {
    var aboutInline =
      '<section class="section section-first"><div class="container">' +
        '<div class="index-about reveal">' +
          '<div class="index-about-photo"><img src="assets/img/avatar.jpg" alt="' + esc(D.name) + '"></div>' +
          '<div class="index-about-text">' +
            '<h2>关于我</h2>' +
            '<p class="role">' + esc(D.roleLine) + ' · ' + esc(D.location) + '</p>' +
            '<p>' + esc(D.intro) + '</p>' +
            profileChips() +
            '<a class="more-link" href="about.html">查看完整的价值观与教育背景 <span>→</span></a>' +
          '</div>' +
        '</div>' +
      '</div></section>';

    var viewAll = function (href, text) {
      return '<div class="section-cta"><a class="btn-lg" href="' + href + '">' + text + '<span class="arrow">→</span></a></div>';
    };

    root.innerHTML =
      '<section class="hero"><div class="container">' +
        '<div class="eyebrow">' + esc(D.name) + ' · ' + esc(D.nickname) + '</div>' +
        '<h1>' + fmt(D.title) + '</h1>' +
        '<div class="tags">' + D.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<p class="meta">' + esc(D.bioShort) + '</p>' +
        '<div class="cta">' +
          '<a class="btn" href="contact.html">联系我</a>' +
          '<a class="btn btn-ghost" href="experience.html">查看经历</a>' +
          '<a class="btn btn-ghost" href="portfolio.html">浏览案例</a>' +
        '</div>' +
      '</div></section>' +
      aboutInline +
      '<section class="section"><div class="container">' + sectionHead('实习经历 · 核心 3 段') +
        '<div class="timeline">' + D.experience.slice(0, 3).map(function (e) { return expBlock(e, false); }).join('') + '</div>' +
        viewAll('experience.html', '查看全部 6 段经历') +
      '</div></section>' +
      '<section class="section"><div class="container">' + sectionHead('项目案例') +
        '<div class="cards">' + D.portfolio.map(portfolioCard).join('') + pendingCard() + '</div>' +
        viewAll('portfolio.html', '查看全部案例') +
      '</div></section>' +
      '<section class="section"><div class="container">' + sectionHead('技能') +
        '<div class="skill-tags">' + D.skillTags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
        viewAll('skills.html', '查看完整技能') +
      '</div></section>';
  }

  function renderAbout() {
    var eduRows = D.education.map(function (e) {
      return '<div class="tl-item reveal"><div class="tl-period">' + esc(e.period) + '</div>' +
        '<div class="tl-body"><h3>' + esc(e.school) + '</h3>' +
        '<div class="tl-role">' + esc(e.major) + '</div>' +
        '<div>' + e.tags.map(function (t) { return '<span class="mini-tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '</div></div>';
    }).join('');
    var traitCards = D.traits.map(function (t) {
      return '<div class="trait reveal"><h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p></div>';
    }).join('');
    root.innerHTML =
      '<section class="section section-first"><div class="container">' +
        '<div class="about-head reveal"><div class="avatar"><img src="assets/img/avatar.jpg" alt="' + esc(D.name) + '"></div>' +
          '<div><h1>' + esc(D.name) + '</h1><p class="about-sub">' + esc(D.roleLine) + '</p>' +
          '<p class="about-meta">' + esc(D.location) + '</p>' + profileChips() + '</div></div>' +
        '<p class="about-intro">' + esc(D.intro) + '</p>' +
      '</div></section>' +
      '<section class="section"><div class="container">' + sectionHead('个人特质') + '<div class="trait-grid">' + traitCards + '</div></div></section>' +
      '<section class="section"><div class="container">' + sectionHead('价值观') + '<ul class="values">' + D.values.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul></div></section>' +
      '<section class="section"><div class="container">' + sectionHead('教育背景') + '<div class="timeline">' + eduRows + '</div></div></section>' +
      '<section class="section"><div class="container">' + sectionHead('在校荣誉') + '<ul class="awards">' + D.awards.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div></section>';
  }

  function renderExperience() {
    root.innerHTML =
      '<section class="section section-first"><div class="container">' +
        '<h1 class="page-title">实习经历 · 共 6 段</h1>' +
        '<p class="lead">' + esc(D.expLead) + '</p>' +
        '<div class="timeline">' + D.experience.map(function (e) { return expBlock(e, true); }).join('') + '</div>' +
      '</div></section>';
  }

  function renderPortfolio() {
    root.innerHTML =
      '<section class="section section-first"><div class="container">' +
        '<h1 class="page-title">项目案例</h1>' +
        '<p class="lead">' + esc(D.portfolioLead) + '</p>' +
        '<div class="cards">' + D.portfolio.map(portfolioCard).join('') + pendingCard() + '</div>' +
        '<p class="note">' + esc(D.portfolioNote) + '</p>' +
      '</div></section>';
  }

  function renderSkills() {
    var groups = D.skills.map(function (g) {
      var rows = g.items.map(function (s) {
        return '<div class="skill-row"><span class="skill-name">' + esc(s.name) + '</span>' +
          '<span class="bar"><i style="width:' + s.level + '%"></i></span>' +
          '<span class="skill-note">' + esc(s.note) + '</span></div>';
      }).join('');
      return '<div class="skills-group reveal"><h3>' + esc(g.name) + '</h3>' + rows + '</div>';
    }).join('');
    root.innerHTML =
      '<section class="section section-first"><div class="container">' +
        '<h1 class="page-title">技能栈</h1>' +
        '<p class="lead">' + esc(D.skillsLead) + '</p>' + groups +
      '</div></section>';
  }

  function renderContact() {
    var rows = [
      ['邮箱', '<a class="u" href="mailto:' + esc(D.email) + '">' + esc(D.email) + '</a>'],
      ['电话', '<a class="u" href="tel:' + esc(D.phone) + '">' + esc(D.phone) + '</a>'],
      ['Base', esc(D.location)]
    ].map(function (r) {
      return '<div class="contact-row reveal"><span class="c-label">' + r[0] + '</span><span class="c-value">' + r[1] + '</span></div>';
    }).join('');
    root.innerHTML =
      '<section class="section section-first"><div class="container">' +
        '<h1 class="page-title">联系我</h1>' +
        '<p class="lead">' + esc(D.contactLead) + '</p>' +
        '<div class="contact-list">' + rows + '</div>' +
        '<div class="cta"><a class="btn" href="assets/files/yangkeer-2026-resume.pdf" download="杨可儿-KIKO-2026秋招简历.pdf">下载 PDF 简历</a></div>' +
        '<p class="note">简历 PDF 1 页（691 KB）· 涵盖 3 段核心实习 + AI 工作流实践 + 奖项与技能</p>' +
      '</div></section>';
  }

  function renderCase() {
    var id = document.body.getAttribute('data-case');
    var cd = D.caseDetails && D.caseDetails[id];
    if (!cd) {
      root.innerHTML = '<section class="section section-first"><div class="container"><a class="crumb" href="portfolio.html">← 返回案例列表</a><h1 class="page-title">案例不存在</h1></div></section>';
      return;
    }
    var blocks = cd.blocks.map(function (b) {
      return '<div class="case-block reveal"><h3>' + esc(b.title) + '</h3><ul>' +
        b.items.map(function (i) { return '<li>' + fmt(i) + '</li>'; }).join('') + '</ul></div>';
    }).join('');
    var preview = D.previews && D.previews[id];
    var hasPreview = preview && preview.pages && preview.pages.length;
    var previewRow;
    if (cd.noPreview) {
      previewRow = '<div class="case-preview-row"><span class="preview-hint">聚焦思路与流程的完整复盘 · 阅读下方文字与结构化沉淀即可</span></div>';
    } else {
      var previewBtn = hasPreview
        ? '<button class="preview-btn preview-btn-lg" data-preview="' + esc(id) + '">预览 PPT · ' + preview.pages.length + ' 页 <span class="arrow">→</span></button>'
        : '<button class="preview-btn preview-btn-pending preview-btn-lg" disabled>PPT 整理中</button>';
      previewRow = '<div class="case-preview-row">' + previewBtn + '<span class="preview-hint">在线翻页预览 · 支持键盘 / 触屏翻页</span></div>';
    }
    root.innerHTML =
      '<section class="case-hero"><div class="container">' +
        '<a class="crumb" href="portfolio.html">← 返回案例列表</a>' +
        '<h1>' + fmt(cd.title) + '</h1>' +
        '<p class="sub">' + esc(cd.sub) + '</p>' +
        '<div class="card-org">' + esc(cd.org) + '</div>' + metricTags(cd.metrics) +
        previewRow +
      '</div></section>' +
      '<section class="section"><div class="container">' + blocks + '</div></section>';
  }

  function initReveal() {
    var els = root.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    for (var j = 0; j < els.length; j++) obs.observe(els[j]);
  }

  function initPreviewButtons() {
    var btns = document.querySelectorAll('[data-preview]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var key = this.getAttribute('data-preview');
        var p = D.previews && D.previews[key];
        if (p && window.PPTViewer) {
          window.PPTViewer.open({ title: p.title, pages: p.pages });
        }
      });
    }
  }

  var renderers = {
    index: renderIndex, about: renderAbout, experience: renderExperience,
    portfolio: renderPortfolio, skills: renderSkills, contact: renderContact, case: renderCase
  };

  renderHeader();
  renderFooter();
  if (renderers[page]) renderers[page]();
  initReveal();
  initPreviewButtons();
})();
