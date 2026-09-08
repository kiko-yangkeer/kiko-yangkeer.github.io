# Portfolio · 杨可儿 / KIKO

个人求职作品集网站 —— 13 份品牌策划、行业分析、AI 工作流案例的线上展示。

## 🌐 在线访问

- 公网地址：<https://kiko-yangkeer.github.io>
- 部署平台：GitHub Pages（绑定本仓库 `kiko-yangkeer.github.io`）

## 📁 文件结构

```
portfolio-site/
├── index.html              首页
├── about.html              关于我
├── experience.html         实习经历
├── skills.html             能力与兴趣
├── portfolio.html          案例列表（13 个案例）
├── contact.html            联系方式
├── case-*.html             13 个案例详情页
├── assets/
│   ├── css/style.css       站点样式（Notion 极简黑白 + 波点）
│   ├── js/site-data.js     案例数据（单一数据源）
│   ├── js/main.js          渲染逻辑
│   ├── js/ppt-viewer.js    PPT 弹窗预览组件
│   ├── img/                头像、插画等图片
│   └── ppt/<slug>/         各案例 PPT 转好的 JPG 预览图
└── tools/                  PDF 转图片等构建脚本（不入库也可）
```

## 🔧 本地预览

```bash
cd portfolio-site
python3 -m http.server 8123
# 浏览器打开 http://localhost:8123/
```

## ✏️ 修改站点

| 改什么 | 改哪里 |
|---|---|
| 案例内容（标题/简介/指标/详情）| `assets/js/site-data.js` |
| 样式（颜色/字体/间距/波点）| `assets/css/style.css` |
| PPT 预览图 | 替换 `assets/ppt/<slug>/0N.jpg` 后 `?v=N+1` |
| 个人信息 | `assets/js/site-data.js` → `profile` 字段 |

> 💡 修改后给所有 HTML 文件的 `?v=12` 升级到 `?v=13` 等，避免缓存。

## 🆕 新增一个案例的流程

1. 把 PDF 放进 `tools/source.pdf`，运行 `pdf_batch_convert.py` 输出预览图到 `assets/ppt/<slug>/`
2. 在 `site-data.js` 的 `portfolio` 数组里加一项（`href/title/org/summary/metrics/previewKey`）
3. 在 `previews` 里加一项（同名 previewKey，pages 数组填 `01.jpg` ~ `NN.jpg`）
4. 在 `caseDetails` 里加一项（同 previewKey，title/org/sub/metrics/blocks）
5. 新建 `case-<slug>.html`，复制其他 `case-*.html` 改一处变量名

## 🚀 发布流程

```bash
git add .
git commit -m "update content"
git push origin main
# 等 30-60 秒，刷新 https://kiko-yangkeer.github.io 即生效
```

## 🪪 License

© 2026 杨可儿 / KIKO · 个人作品集，未经授权请勿转载

头像、案例内容仅用于求职投递与个人展示，不得用于商业用途。
