# COWIN MAGNET GSC / 技术 SEO 问题清单

检查日期：2026-10-27（北京时间）。目标：`https://www.cowinmagnet.com`。原始依据为站点所有者提供的 GSC 邮件摘要；邮件中的两个属性可能重叠，以下数字不相加为“已收录页数”。

## 已确认的生产基线

可复现命令：`node scripts/gsc-seo-audit.mjs --phase=before --concurrency=8`。原始逐 URL 证据见 [before.csv](./before.csv) 和 [before.json](./before.json)。

- Sitemap 175 个 URL，全部返回 200、具有自指 canonical、没有 `noindex`；检查范围另含 38 个跳转、故意排除页及站内链接样本，总计 213 个 URL。
- 发现 **3 类实际可修问题**。同一 URL 可同时出现结构化数据和描述问题，不能把下面的次数相加当成独立页面数。
- 当前 Chrome 中已登录的 Google 账号无权访问 `cowinmagnet.com` 域名属性。因此 GSC 邮件中的受影响 URL 样本、当前已收录数和 Google 选定 canonical **未能实时取得**。

| 类别 | 严重度 | 受影响范围与证据 | 判断 | 处理 |
| --- | --- | --- | --- | --- |
| 缺少 Product 摘要必要条件 | P0 | 88 个 Sitemap 产品详情页、另 5 个非英文抽样产品页输出 `Product` JSON-LD，却均无 `offers`、`review`、`aggregateRating`；例如 `/en/products/rcyd-type-permanent-magnet-self-dumping-iron-remover`。 | 定制 B2B 设备无可核实的公开固定报价或评价，不能用假价格或评分补齐。 | 产品详情统一改为 `ItemPage` + `Thing`，保留页面事实、图片与询盘；不宣称 Product 富媒体资格。 |
| 产品描述以省略号截断 | P1 | 65 个 Sitemap 产品页的 meta description 以 `...` 结尾；例如 `/en/products/cbz-type-rotary-automatic-magnetic-separator`。 | 现有截断函数会把句子切断，影响搜索摘要可读性。 | 改为不超过 160 字符、完整句子的事实性描述。 |
| 已链接的可收录页漏入 Sitemap | P1 | `/en/editorial-policy` 返回 200、自指 canonical、无 `noindex`，但不在 175 个 URL 中，且新闻作者链接指向它。 | 站点地图漏项。 | 补入英文编辑政策页，使用该文档真实 Git 更新时间，并提升 Sitemap 策略版本以刷新持久快照。 |

## 已核实为正常状态，保留不改

| 状态 | 实测数量 | 说明 |
| --- | ---: | --- |
| `noindex` | 31 个抽样 URL | 非英文内容仍待完整编辑审核、站内搜索页、待复核的旧新闻；这些页不在主 Sitemap 中。不可全站强制 `index`。 |
| 308 跳转 | 5 个测试 URL | HTTP→HTTPS、非 www→www、`/`→`/en`、旧 `/applications`→行业页、`/search`→`/en/search`。最终目的地可访问。 |
| 404 | 1 个故意构造的不存在 URL | 应维持 404，不应统一跳回首页。 |

五条可见的旧新闻 URL 保持 `noindex` 且仍可供访客阅读；这与既有编辑审核政策一致。多语言页面也维持自指 canonical 和 `noindex`，不伪装成已完成翻译的可收录版本。主 Sitemap 仅列英文标准 URL；英文项只声明 `en` 和 `x-default`。

## 仍需 GSC 平台核对

附件中的 Google 邮件提到“已发现但未收录”验证通过（759，两个属性可能重叠）、规范替代页、Google 选择其他 canonical、`noindex`、404、跳转和产品摘要。邮件未附全部受影响 URL。**验证通过不等于已收录**；当前只能证明仓库/生产 URL 的技术状态，不能认定 GSC 的历史清单都已清零。站点所有者需在可访问的 GSC 属性中导出各原因的示例 URL，尤其是历史 404、重复规范页与产品摘要页，再与本清单逐条对照。

Google 规则依据：[Product 摘要必要字段](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)、[canonical 信号一致性](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)、[Sitemap 中列首选标准 URL](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。

## 上线后处理结果

2026-10-27 生产版本 `6320f3e5becfac4fda6737b47d7396bf20262ae5` 的同法复查覆盖 213 个 URL；上述 **3 类可修问题均已解决**，审计 `issueCounts` 为空。具体 URL 与字段见 [GSC_SEO_URL_检查结果.csv](./GSC_SEO_URL_检查结果.csv) 和 [after.json](./after.json)。Sitemap 从 175 条增加到 176 条，新增项仅为 `/en/editorial-policy`；全量 176 条均返回 200，未见意外 `noindex`、重定向或失效链接。

基线中的 `noindex`、308 和 404 是 3 类正常状态，仍按原意保留。**GSC 历史问题条目是否已经在 Google 平台关闭，仍待具有属性权限的站点所有者核对**；线上技术复查不能代替 Google 的重新抓取与验证。
