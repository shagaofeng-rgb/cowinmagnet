# COWIN MAGNET GSC / 技术 SEO 测试与验收

检查日期：2026-10-27（北京时间）。详细 URL 证据见同目录 `before.csv`、`before.json`，以及部署后生成的 `GSC_SEO_URL_检查结果.csv`、`after.json`。

## 本地结果

- `eslint .`：0 错误；4 个既有远程 CMS `<img>` 性能警告，与本次 SEO 标记改动无关。
- `tsc --noEmit`：通过。
- `next build --webpack`：通过；869 个静态页面生成成功。
- `node --test tests/*.test.mjs`：112 项通过、0 失败。
- 本地 `final-audit-smoke.mjs`：公开检查 0/17 失败，后台权限检查 0/2 失败。
- 本地 monitor：22 页，Healthy，P0/P1/P2/P3 均为 0；其内置视觉子任务未启用（缺少 Playwright），另由独立 Chrome/CDP 视觉回归覆盖。
- 独立浏览器在 390px/1440px 首页、390px 产品详情及阿拉伯语首页抽查：无全页横向溢出、失效图片或控制台错误；移动导航可开合。内层横向产品分类条可滚动，不计为全页溢出。
- 本地同法 URL 审计：109 个可获取的本地 Sitemap URL，合计 137 个 URL，0 个检测问题。本地未连接生产 CMS，因而 URL 总数小于生产，不用该数字替代生产验收。
- 本地渲染 HTML：CBZ 产品详情输出完整的 meta description 与 `ItemPage`/`Thing`，无 `Product`/虚构报价；`/en/editorial-policy` 出现在 Sitemap，`lastmod` 为 2026-09-27。

## 生产验收

- Git `6320f3e5becfac4fda6737b47d7396bf20262ae5` 已推送 `origin/main`；Vercel 生产部署 `dpl_C8Kq2Qi5JD4LPDPkWUG3SJcXEJvx` 状态 `READY`，`cowinmagnet.com` 与 `www.cowinmagnet.com` 均为该版本别名。
- `node scripts/gsc-seo-audit.mjs --phase=after --concurrency=8`：与基线相同的 213 个 URL，同一检查方法，3 类可修问题从 93 / 65 / 1 次命中降为 0 / 0 / 0；详见 [after.csv](./after.csv)、[after.json](./after.json) 及 [GSC_SEO_URL_检查结果.csv](./GSC_SEO_URL_检查结果.csv)。总 URL 数不变是因为新增 Sitemap URL 与抽样去重，前后共同 URL 可逐行比较。
- `node scripts/audit-sitemap-http.mjs --concurrency=6 --timeout=15000`：176/176 个 Sitemap URL 返回 200，异常 0。
- `SITE_URL=https://www.cowinmagnet.com node scripts/final-audit-smoke.mjs`：公开检查失败 0/18，后台权限检查失败 0/2；覆盖首页跳转、产品/新闻等公开入口、robots、Sitemap、新闻地图及 feed。
- 独立 Chrome/CDP 生产视觉抽查：英文首页 390px/1440px、英文产品详情 390px、阿拉伯语首页 390px。4 页的整页宽度均等于视口；破图、控制台报错、失败请求均为 0；3 个移动页面的导航抽屉能打开并关闭。截图与机器报告保存在本机 `/tmp/cowin-gsc-seo-20261027-visual-production/`。
- 生产监控检查 36 页：P0 为 0，P1 为 1（根路径一次 5249ms 慢响应），P2 为 4（旧路径 5–7 秒响应），P3 为 5（个别图片/脚本加载慢）；这是性能观察，不是可收录性或状态码失败。监控自带 Playwright 视觉子任务未启用，故另用上述 Chrome/CDP 抽查。
- 代表性产品页线上 HTML 的 JSON-LD 可解析，`ItemPage`/`Thing` 与 Breadcrumb/FAQ 等页面内容一致；无缺少真实报价或评论的 `Product` 富媒体声明。Google Rich Results Test 页面可打开，但本次测试动作未返回报告，故不声称 Google 外部测试通过或产品富媒体资格。该类定制产品无公开固定报价/可核实评论，产品富媒体结果不适用。
- 未发送真实询盘或伪装客户信息；`tests/smtp-envelope.test.mjs` 等已有表单通知测试通过，生产抽查确认询盘入口可访问。邮件投递与后台收件的端到端状态不在本次无测试数据验收结论中。

## GSC 与提交状态

当前 Chrome 中已登录的 Google 账号无权访问该站 GSC 属性，无法读取实时已收录数、Google 选定 canonical、历史问题示例 URL 或点击“验证修复”。Vercel 生产环境已配置 Sitemap 维护任务，按既有设置每周一 02:35 UTC 运行；本次没有可用的 GSC 属性权限或可读取的受保护任务凭据，因此**未宣称已手动向 GSC 提交 Sitemap**。`robots.txt` 已公开声明 [Sitemap](https://www.cowinmagnet.com/sitemap.xml)。

具有属性权限的站点所有者下一步应在两种属性的“网页索引编制”中核对 Product 摘要错误、历史 404、替代规范页及“已发现但尚未收录”的示例 URL；对已修复的 Product 摘要错误点击“验证修复”，在“Sitemaps”确认 `https://www.cowinmagnet.com/sitemap.xml` 的提交/读取状态。建议先观察 2–4 周的抓取与验证变化，并记录 Google 实际报告的日期；不要把邮件中的 759 次验证通过写成已收录页数。Google 对 Sitemap 的接受也不保证任何单独 URL 被抓取或收录。
