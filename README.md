# Ryan’s Notes · 个人博客

一个可以长期写作的中文静态博客。使用 Astro，生成纯 HTML/CSS；不需要数据库、后台服务或 API Key。支持 GitHub Pages，也可以把 `dist/` 部署到其他静态托管服务。

现已收录保研经历与 AI 时代的思考文章。三篇演示文章保存在 `templates/examples/`，不会发布。

外观默认跟随系统，可通过导航旁的「外观」选择浅色、深色或重新跟随系统。手动设置会在当前浏览器保存，切换页面和再次访问时继续生效；跟随系统时会实时响应系统主题变化。文章代码高亮也会同步切换。

## 1. 本地运行

安装 Node.js 24 LTS（最低 22.12.0），在本文件所在目录执行：

```bash
npm install
npm run dev
```

打开终端显示的本地地址，通常是 http://localhost:4321 。修改 Markdown 后页面会自动更新。

```bash
npm run check   # 类型与模板检查
npm run build   # 生成 dist/ 静态文件
npm run preview # 预览构建结果
```

首次获取项目使用 `npm install`；已有 package-lock.json 时也可用 `npm ci` 重现锁定的依赖。

## 2. 放入 Markdown 就能写作

把 `.md` 文件放进 **`content/posts/`**，支持子目录。示例：

```text
content/posts/
├── my-first-post.md
└── learning/
    ├── notes.md
    └── diagram.png
```

普通 Markdown **不用填写任何额外信息也能显示**：标题优先取第一个 `# 标题`，否则取文件名；摘要自动提取；没有日期的文章放在末尾，归档中显示“未注明日期”。首段的一级标题在正文中隐藏，避免和页面标题重复。

需要日期、标签、摘要或草稿时，在文件最开头加入 YAML frontmatter：

```markdown
---
title: "我的第一篇文章"
description: "这篇文章讲了什么。"
date: 2026-09-30
tags: [学习, 随笔]
draft: false
---

正文从这里开始。

## 一个小标题

继续写你的内容。
```

- 所有字段都可选。`date` 建议使用 `YYYY-MM-DD`；带时区的日期按 UTC 显示。
- `draft: true` 不生成文章页，也不会出现在首页、归档。写好后改成 `false`，或删除这一行。
- 文件名决定网址，推荐短英文小写加连字符，如 `my-first-post.md` → `/posts/my-first-post/`。中文文件名也支持。子目录保留在网址中。避免使用仅大小写或标点不同的文件名，以免规范化后重名。
- 首页展示最近 5 篇；归档展示全部文章；文章页自动生成可展开的二、三级标题目录。
- 支持表格、任务列表、引用、代码高亮。这里是标准 Markdown，不包含 MDX、Obsidian 双链、LaTeX 数学公式或 Mermaid 扩展。
- Markdown 可含 HTML。仅放入你信任并希望公开的内容。

也可以一条命令创建草稿（不会覆盖已有文件）：

```bash
npm run new -- "我的第一篇文章" my-first-post
```

或复制 `templates/post.md` 到文章目录。模板本身不会发布。

### 图片与链接

文章内图片推荐和文章放在一起，使用相对路径：

```markdown
![图片说明](./diagram.png)
```

Astro 会处理本地图片和部署路径。图片文件不会被当作文章。

站外链接正常写完整网址。文章之间的链接请使用**生成后页面的相对网址**，而不是 `.md` 文件路径。例如，`/posts/hello-world/` 页面链接到同级文章：

```markdown
[另一篇文章](../writing-in-markdown/)
```

有子目录时相应调整 `../` 层数。不要在 Markdown 里写 `/images/x.png`、`/posts/x/` 这样的站点根路径：它们会跳过 GitHub 项目仓库的子路径。相对链接在本地与 GitHub Pages 都可用。

## 3. 改成你自己的博客

编辑 **`src/site.config.ts`**：博客名称、作者、简介、关于页文案。首页主标题与短句在 `src/pages/index.astro`；样式在 `src/styles/global.css`；站点图标在 `public/favicon.svg`。

把自己的文章放入 `content/posts/` 即可。演示文章保存在 `templates/examples/`，不会出现在博客中。

## 4. 以后部署到 GitHub Pages

此项目通过 `.github/workflows/deploy.yml` 发布到 GitHub Pages，后续提交到 `main` 会自动重新构建发布。

1. 在 GitHub 创建仓库，把本目录的**内容**放到仓库根目录（`package.json` 应在根目录），默认分支用 `main`。不要提交 `node_modules/` 或 `dist/`，`.gitignore` 已排除它们。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 打开 **Actions → Deploy blog to GitHub Pages → Run workflow**，或者再次提交到 `main`。
4. 工作流会安装依赖、检查、构建并发布。以后只要把新文章提交到 `main`，就会重新部署。

工作流从 GitHub Pages 配置读取域名与子路径，因此同时支持 `用户名.github.io` 和普通项目仓库 `用户名.github.io/仓库名/`，无需手改项目名。若采用自定义域名，先在 GitHub Pages 设置里配置并完成域名 DNS 设置，再重新运行工作流。

工作流默认在推送 `main` 时部署。如果你暂时不希望推送触发部署，删除 `deploy.yml` 中的 `push` 两行，只保留 `workflow_dispatch` 即可改为手动发布。还没启用 Pages 时，部署工作流可能失败，按上述步骤启用后重跑即可。

本地检查项目子路径可执行：

```bash
SITE_URL=https://example.github.io BASE_PATH=/my-blog npm run build
BASE_PATH=/my-blog npm run preview
```

然后访问终端地址下的 `/my-blog/`。普通本地构建默认使用正式站点 `https://blogs.icelon.top/`；部署到其他域名时设置 `SITE_URL`。canonical、Open Graph、sitemap、robots 与 RSS 共用该地址，并统一使用 HTTPS。

参考：[Astro 官方 GitHub Pages 部署文档](https://docs.astro.build/en/guides/deploy/github/)。

## 文件结构

```text
content/posts/           你的 Markdown 文章与文章图片
src/site.config.ts       博客名称、作者、关于页
src/content.config.ts    Markdown 内容字段定义
src/pages/               首页、归档、关于、文章和 404
src/layouts/             页面框架及 SEO 元信息
src/components/          文章列表组件
src/styles/global.css    全站样式与移动端适配
scripts/new-post.mjs     新建草稿命令
templates/post.md        手动复制用的文章模板
public/                 图标和不需处理的静态资源
.github/workflows/       GitHub Pages 自动构建部署流程
astro.config.mjs         静态构建、站点地址和子路径
```
