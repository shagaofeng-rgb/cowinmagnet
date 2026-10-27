# COWIN MAGNET GSC / 技术 SEO 修复记录

## 改动范围

| 文件 | 修复内容 |
| --- | --- |
| `components/ProductDetailExperience.tsx`、`lib/productPageSchema.ts` | 所有语言的定制设备详情页使用与可见内容一致的 `ItemPage`/`Thing`，不生成无依据的 `Product` 富媒体标记。保留产品正文、图片、面包屑、FAQ、WhatsApp 和询盘按钮。 |
| `data/productDetailProfiles.ts`、`lib/productMetaDescription.ts` | 产品 meta description 不再截断为不完整的省略号句。 |
| `lib/sitemap/source.js` | 将英文编辑政策页加入 Sitemap，其他非英文/待审核内容仍按原规则排除。 |
| `lib/sitemap/service.js` | 提升策略版本，使线上存储的旧 Sitemap 快照在部署后重建。 |
| `scripts/build-sitemap-static-dates.mjs`、`data/sitemapStaticDates.json` | 单独记录编辑政策文档的真实 Git 更新时间，不按构建日伪造 `lastmod`。 |
| `scripts/gsc-seo-audit.mjs`、`tests/product-page-schema.test.mjs`、`tests/product-meta-description.test.mjs` | 增加可复现的逐 URL 审计与回归测试。 |

## 生产前后对比

| 项目 | 修复前 | 生产复查 |
| --- | ---: | ---: |
| 受检 URL | 213 | 213 |
| Product 摘要必要字段错误 | 93 个抽样命中 | 0 |
| 省略号截断的产品 meta description | 65 个命中 | 0 |
| 已链接、可收录但漏入 Sitemap | 1 个 | 0 |
| Sitemap URL | 175 | 176 |
| Sitemap 中 HTTP/索引指令异常 | 0 | 0 |

上述前三行可能涉及同一页面，不能相加为独立 URL 数。生产部署为 Vercel `dpl_C8Kq2Qi5JD4LPDPkWUG3SJcXEJvx`，对应 Git 提交 `6320f3e5becfac4fda6737b47d7396bf20262ae5`；`cowinmagnet.com` 与 `www.cowinmagnet.com` 均已指向该部署。

## 未改动及原因

- 未添加价格、库存、评分、客户评价、认证或产品参数：没有可公开且可核实的业务数据。
- 未将非英文页强制开放索引：现有翻译审核政策仍适用。
- 未把 404 统一重定向到首页，也未取消有效的 308 规范化跳转。
- 未批量请求 URL 索引；Sitemap 提交与 Google 页面索引是两个不同结果。
- 未改动生产数据库、产品记录、询盘记录、已有图片、部署域名或用户原有的两个未跟踪 pnpm 文件。

## 风险与回退

- 旧 `Product` 富媒体错误会留在 GSC 历史报告中，直到 Google 重新抓取并且站点所有者在该问题报告中发起“验证修复”；这不代表线上标记仍错误。
- 生产网站监控另记录根路径一次 5249ms 响应和 4 个旧路径的 5–7 秒响应；页面可访问、跳转正确，尚不能从单次外部监控归因到本次 SEO 变更。该性能观察单列在验收报告中，后续可用同区域多次测量与 Vercel 函数指标排查。
- 失去原本没有合规报价/评价支撑的 Product 富媒体资格是有意结果；普通网页收录、产品可见内容与询盘不依赖该富媒体资格。
- Git 回退点：`codex/pre-gsc-seo-20261027`（原始提交 `ec046ffd5f7599aef6ae4687e8bde7b00086120f`）。本机公开素材与未跟踪配置备份位于 `/tmp/cowin-gsc-seo-20261027.9mPn9a/public-and-local-config.tgz`；没有进行数据库写入或迁移。
- 若生产验收失败，优先通过 Vercel 将两个域名恢复到此前已验证的部署，再在 Git 中逆向提交本次变更；不得重置或删除用户数据。
