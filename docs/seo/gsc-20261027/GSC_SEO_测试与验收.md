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

## 生产与 GSC 状态

生产部署、生产同法 URL 扫描、两个域名别名、生产 monitor、代表性 Google 富媒体测试以及 GSC 平台“验证修复”状态，均以部署后的实测结果更新本节。当前 Google 浏览器账号无权访问该站 GSC 属性；不能报告实时索引数量、排名提升或产品富媒体已显示。Google 的 Sitemap 接受也不保证任何单独 URL 会被抓取或收录。
