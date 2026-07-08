# Cowinmagnet 中文后台优化实施计划

## 当前项目情况

- 项目为 Next.js App Router 网站，已包含前台页面、后台 `/admin`、API Routes、Vercel Cron、PostgreSQL/Neon 数据层和邮件发送配置。
- 后台已使用简体中文界面，当前核心模块包括数据总览、流量分析、SEO 数据、产品管理、新闻管理、客户表单、内外链审计、访客记录、页面表现、访问路径和系统设置。
- 历史产品、新闻、访客、SEO、自动新闻和 analytics 数据均保留；本次优化只做增量表结构和软删除状态，不清空旧数据。

## 技术架构

- 前端/后台：Next.js + React。
- 数据库：PostgreSQL，使用 `pg` 连接池。
- 后台认证：已有 admin session cookie 和服务端 API 校验。
- 内容存储：产品/新闻使用 `cms_items`，询盘使用新增 `inquiry_submissions`。
- Analytics：使用 `analytics_events`、`traffic_events`、`analytics_snapshots` 等已有表。
- 定时任务：使用 Vercel Cron 调用站内 API。

## 本阶段已实施

- 后台左侧品牌标识已改为网站 logo。
- 新增客户表单管理模块 `/admin/inquiries`。
- 表单提交 `/api/inquiry` 已改为先持久化保存，再发送邮件通知；邮件失败不会导致表单数据丢失。
- 新增 `inquiry_submissions` 表，支持状态、国家、关键词、服务端分页和状态更新。
- 产品管理和新闻管理列表增加服务端分页与每页数量选择。
- 产品和新闻删除按钮改为归档软删除，前台隐藏但后台历史数据保留。
- 访客、页面、路径等后台表格默认每页 20 条，支持 10/20/50/100。

## 安全方案

- 后台页面通过 `requireAdminSession` 保护。
- 后台 API 通过 `requireAdminApi` 校验。
- 表单输入已有服务端校验、honeypot、频率限制和长度限制。
- 密码、SMTP、数据库、Google Search Console 等敏感配置继续使用环境变量，不写入源码。
- 询盘数据写库，不写入日志明文。

## 测试方案

- 代码修改后运行生产构建。
- 执行现有 smoke verify。
- 重点检查后台登录、产品页、新闻页、客户表单页、Analytics API、询盘提交 API。

## 部署方案

- 本地构建通过后部署到 Vercel Production。
- 部署后检查正式域名后台页面和公开页面。
- 如上线后发现异常，可回滚到上一版 Vercel Production Deployment。

## 后续扩展

- 完整角色/权限矩阵、操作日志审计表、媒体库对象存储、导入导出任务队列和 Docker 运维文档属于更大阶段，可在现有结构上继续增量开发。
- 不建议一次性重写后台；继续按模块逐步替换和增强，风险更低。

