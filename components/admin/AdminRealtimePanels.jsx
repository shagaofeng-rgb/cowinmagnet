"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarList, CsvExportButton, MetricCard, TrendChart } from "@/components/admin/AdminWidgets";

const refreshMs = 30 * 60 * 1000;
const syncStatusRefreshMs = 2 * 60 * 1000;
const defaultPageSize = 10;
const pageSizeOptions = [10, 20, 50];
const countryNameZh = {
  US: "美国",
  GB: "英国",
  UK: "英国",
  CN: "中国",
  ZA: "南非",
  GM: "冈比亚",
  ET: "埃塞俄比亚",
  DE: "德国",
  FR: "法国",
  ES: "西班牙",
  PT: "葡萄牙",
  RU: "俄罗斯",
  AE: "阿联酋",
  SA: "沙特阿拉伯",
  IN: "印度",
  ID: "印度尼西亚",
  MY: "马来西亚",
  TH: "泰国",
  VN: "越南",
  PH: "菲律宾",
  SG: "新加坡",
  JP: "日本",
  KR: "韩国",
  AU: "澳大利亚",
  NZ: "新西兰",
  CA: "加拿大",
  MX: "墨西哥",
  BR: "巴西",
  AR: "阿根廷",
  CL: "智利",
  PE: "秘鲁",
  CO: "哥伦比亚",
  TR: "土耳其",
  IT: "意大利",
  NL: "荷兰",
  BE: "比利时",
  PL: "波兰",
  SE: "瑞典",
  NO: "挪威",
  FI: "芬兰",
  DK: "丹麦",
  IE: "爱尔兰",
  CH: "瑞士",
  AT: "奥地利",
  CZ: "捷克",
  HU: "匈牙利",
  RO: "罗马尼亚",
  GR: "希腊",
  UA: "乌克兰",
  IL: "以色列",
  EG: "埃及",
  NG: "尼日利亚",
  KE: "肯尼亚",
  MA: "摩洛哥",
  DZ: "阿尔及利亚",
  PK: "巴基斯坦",
  BD: "孟加拉国",
  LK: "斯里兰卡",
  IR: "伊朗",
  IQ: "伊拉克",
  QA: "卡塔尔",
  KW: "科威特",
  OM: "阿曼"
};

function useLiveAnalytics(initialData) {
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [data, setData] = useState(initialData);
  const [state, setState] = useState({ loading: false, error: "", syncedAt: "" });

  useEffect(() => {
    setData(initialData || {});
  }, [initialData]);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        setState((current) => ({ ...current, loading: true, error: "" }));
        const response = await fetch(`/api/admin/analytics${search ? `?${search}` : ""}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to refresh analytics data");
        const nextData = await response.json();
        if (!active) return;
        setData(nextData);
        setState({
          loading: false,
          error: "",
          syncedAt: new Date().toLocaleTimeString("zh-CN", {
            timeZone: "Asia/Shanghai",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          })
        });
      } catch {
        if (!active) return;
        setState((current) => ({ ...current, loading: false, error: "实时刷新失败，页面仍显示上一次成功数据。" }));
      }
    }

    refresh();
    const timer = window.setInterval(refresh, refreshMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [search]);

  return { data: data || {}, state };
}

function useLiveContentStats(initialStats) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const response = await fetch("/api/admin/content/summary", { cache: "no-store" });
        if (!response.ok) return;
        const nextStats = await response.json();
        if (active) setStats(nextStats);
      } catch {
        // Keep the last successful content snapshot visible.
      }
    }

    refresh();
    const timer = window.setInterval(refresh, refreshMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return stats || {};
}

function LegacyLiveSyncNote({ state }) {
  return (
    <div className={`admin-live-note ${state.error ? "error" : ""}`}>
      <span>{state.loading ? "正在同步最新数据..." : "半小时自动同步已开启"}</span>
      <small>{state.error || `最近同步：${state.syncedAt || "初始化中"}（北京时间，每 30 分钟刷新一次）`}</small>
    </div>
  );
}

function useSyncStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const response = await fetch("/api/admin/sync-status", { cache: "no-store" });
        if (!response.ok) return;
        const nextStatus = await response.json();
        if (active) setStatus(nextStatus);
      } catch {
        // Keep the latest visible sync status.
      }
    }

    refresh();
    const timer = window.setInterval(refresh, syncStatusRefreshMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return status;
}

function formatSyncTime(value) {
  if (!value) return "-";
  return formatBeijingDateTime(value);
}

function LiveSyncNote({ state }) {
  const syncStatus = useSyncStatus();
  const latest = syncStatus?.latest;
  const latestSuccess = syncStatus?.latestSuccess;
  const statusText = latest?.status || "waiting";

  return (
    <div className={`admin-live-note ${state.error ? "error" : ""}`}>
      <span>{state.loading ? "正在读取最新后台数据..." : "30 分钟自动同步已配置"}</span>
      <small>
        {state.error ||
          `前端刷新：${state.syncedAt || "初始化中"}；Cron 最近执行：${formatSyncTime(latest?.finishedAt)}；最近成功：${formatSyncTime(latestSuccess?.finishedAt)}；状态：${statusText}；处理量：${latest?.processedCount ?? 0}`}
      </small>
    </div>
  );
}

function StorageAlert({ storageMode }) {
  if (storageMode === "database") {
    return (
      <section className="admin-alert success">
        <strong>Analytics 数据库已连接</strong>
        <span>PV、UV、访问记录、来源渠道和页面表现都从真实 analytics_events 数据读取。</span>
      </section>
    );
  }

  return (
    <section className="admin-alert warning">
      <strong>Analytics 数据库尚未接入</strong>
      <span>当前统计存储模式为 {storageMode || "unknown"}。系统会继续读取真实 page_view 访问记录，正式长期统计建议接入 Postgres 数据库。</span>
    </section>
  );
}

function formatBeijingDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function list(rows) {
  return Array.isArray(rows) ? rows : [];
}

function displayCountry(country) {
  const value = String(country || "").trim();
  if (!value || value.toLowerCase() === "unknown") return "未知";
  const code = value.toUpperCase();
  return countryNameZh[code] || value;
}

function displayText(value) {
  const text = String(value || "").trim();
  return text || "-";
}

function displayCountryRows(rows) {
  return list(rows).map((row) => ({
    ...row,
    displayLabel: displayCountry(row.label || row.country || row.title)
  }));
}

function customerNumber(value) {
  return `C${String(value || 0).padStart(5, "0")}`;
}

function customerType(item) {
  return item.visitDayNumber === 1 ? "新客户" : "老客户";
}

function visitDay(item) {
  return `第 ${item.visitDayNumber || 1} 次访问日`;
}

function searchableText(...values) {
  return values.map((value) => String(value || "").toLowerCase()).join(" ");
}

function PageSizeSelect({ pageSize, onChange }) {
  return (
    <label className="admin-page-size">
      每页
      <select value={pageSize} onChange={(event) => onChange(Number(event.target.value))}>
        {pageSizeOptions.map((option) => (
          <option value={option} key={option}>{option} 条</option>
        ))}
      </select>
    </label>
  );
}

function PaginationControls({ page, totalPages, totalRows, pageSize, setPage, setPageSize }) {
  return (
    <div className="admin-pagination">
      <span>共 {totalRows} 条</span>
      <PageSizeSelect pageSize={pageSize} onChange={setPageSize} />
      <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>上一页</button>
      <span>第 {page} / {totalPages} 页</span>
      <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>下一页</button>
    </div>
  );
}

function usePagedRows(rows, filteredRows) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function changePage(nextPage) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  function changePageSize(nextPageSize) {
    setPageSize(pageSizeOptions.includes(nextPageSize) ? nextPageSize : defaultPageSize);
    setPage(1);
  }

  function resetPage() {
    setPage(1);
  }

  return {
    page: safePage,
    pageSize,
    totalPages,
    pageRows,
    totalRows: filteredRows.length,
    setPage: changePage,
    setPageSize: changePageSize,
    resetPage
  };
}

export function AdminOverviewRealtime({ initialData, contentStats }) {
  const { data, state } = useLiveAnalytics(initialData);
  const liveContentStats = useLiveContentStats(contentStats);
  const { overview = {}, traffic = {}, pages = [], searchConsole = {}, storageMode } = data;

  return (
    <>
      <LiveSyncNote state={state} />
      <StorageAlert storageMode={storageMode} />

      <section className="admin-grid four">
        <MetricCard label="页面浏览量" value={Number(overview.pageViews || 0).toLocaleString()} note="PV" />
        <MetricCard label="独立访客" value={Number(overview.uniqueVisitors || 0).toLocaleString()} note="UV" />
        <MetricCard label="访问会话" value={Number(overview.sessions || 0).toLocaleString()} note="有效访问" />
        <MetricCard label="询盘提交" value={Number(overview.inquiries || 0).toLocaleString()} note="表单提交事件" />
      </section>

      <section className="admin-grid four">
        <MetricCard label="前台产品" value={Number(liveContentStats.products || 0).toLocaleString()} note={`${liveContentStats.cmsProducts || 0} 个来自后台`} />
        <MetricCard label="Blog 文章" value={Number(liveContentStats.blogPosts || 0).toLocaleString()} note="静态专业文章" />
        <MetricCard label="News 新闻" value={Number(liveContentStats.newsPosts || 0).toLocaleString()} note={`${liveContentStats.cmsNews || 0} 个来自后台`} />
        <MetricCard label="应用场景" value={Number(liveContentStats.applications || 0).toLocaleString()} note="静态应用库" />
      </section>

      <section className="admin-panel">
        <p className="eyebrow">内容同步状态</p>
        <h2>前台内容读取方式</h2>
        <p className="admin-muted">
          Products 和 News 已接入后台 CMS。后台保存、发布、下架或删除后，会触发前台对应页面和 sitemap 重新验证。
          当前 CMS 存储模式：<strong>{liveContentStats.cmsStorageMode || "unknown"}</strong>。
        </p>
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">流量趋势</p>
          <h2>每日 PV / UV</h2>
          <TrendChart rows={list(traffic.series)} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">来源渠道</p>
          <h2>客户从哪里来</h2>
          <BarList rows={list(traffic.channels)} />
        </article>
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">来源平台</p>
          <h2>搜索 / 社媒 / AI / 直接访问</h2>
          <BarList rows={list(traffic.sourcePlatforms)} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">热门页面</p>
          <h2>页面表现排行</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>页面</th><th>浏览</th><th>平均停留</th></tr>
              </thead>
              <tbody>
                {list(pages).slice(0, 8).map((page) => (
                  <tr key={page.page}>
                    <td>{page.title}</td>
                    <td>{page.views}</td>
                    <td>{page.avgDuration}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">SEO 快照</p>
          <h2>Google Search Console</h2>
          <div className="admin-mini-metrics">
            <MetricCard label="点击量" value={searchConsole.overview?.clicks || 0} note="GSC" />
            <MetricCard label="曝光量" value={searchConsole.overview?.impressions || 0} note="GSC" />
            <MetricCard label="点击率" value={`${searchConsole.overview?.ctr || 0}%`} note="平均值" />
            <MetricCard label="排名位置" value={searchConsole.overview?.position || 0} note="平均值" />
          </div>
          {!searchConsole.configured ? <p className="admin-muted">Google Search Console API 尚未连接，当前只显示 0 和空表。</p> : null}
        </article>
      </section>
    </>
  );
}

export function AdminTrafficRealtime({ initialData }) {
  const { data, state } = useLiveAnalytics(initialData);
  const { overview = {}, traffic = {} } = data;

  return (
    <>
      <LiveSyncNote state={state} />
      <section className="admin-grid four">
        <MetricCard label="平均停留" value={`${overview.avgDuration || 0}s`} note="页面参与度" />
        <MetricCard label="跳出率" value={`${overview.bounceRate || 0}%`} note="估算值" />
        <MetricCard label="国家地区" value={list(traffic.countries).length} note="活跃市场" />
        <MetricCard label="设备类型" value={list(traffic.devices).length} note="访问设备" />
      </section>
      <section className="admin-panel">
        <p className="eyebrow">每日趋势</p>
        <h2>每日浏览量变化</h2>
        <TrendChart rows={list(traffic.series)} />
      </section>
      <section className="admin-grid four">
        <article className="admin-panel"><p className="eyebrow">获客来源</p><h2>渠道分布</h2><BarList rows={list(traffic.channels)} /></article>
        <article className="admin-panel"><p className="eyebrow">来源平台</p><h2>搜索 / 社媒 / AI / 直接访问</h2><BarList rows={list(traffic.sourcePlatforms)} /></article>
        <article className="admin-panel"><p className="eyebrow">目标市场</p><h2>国家 / 地区</h2><BarList rows={displayCountryRows(traffic.countries)} /></article>
        <article className="admin-panel"><p className="eyebrow">设备环境</p><h2>设备类型</h2><BarList rows={list(traffic.devices)} /></article>
      </section>
    </>
  );
}

export function AdminVisitorsRealtime({ initialData }) {
  const { data, state } = useLiveAnalytics(initialData);
  const visitors = list(data.visitors);
  const [filters, setFilters] = useState({ keyword: "", country: "", source: "" });
  const filteredVisitors = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const country = filters.country.trim().toLowerCase();
    const source = filters.source.trim().toLowerCase();

    return visitors.filter((visitor) => {
      const rowText = searchableText(
        customerNumber(visitor.customerNumber),
        visitor.country,
        visitor.device,
        visitor.browser,
        visitor.channel,
        visitor.sourcePlatform,
        visitor.sourceDetail,
        visitor.page,
        visitor.ip,
        customerType(visitor),
        visitDay(visitor)
      );
      if (keyword && !rowText.includes(keyword)) return false;
      if (country && String(visitor.country || "").toLowerCase() !== country) return false;
      if (
        source &&
        !searchableText(visitor.channel, visitor.sourcePlatform, visitor.sourceDetail).includes(source)
      ) {
        return false;
      }
      return true;
    });
  }, [visitors, filters]);
  const visitorPager = usePagedRows(visitors, filteredVisitors);
  const csvRows = useMemo(
    () =>
      filteredVisitors.map((item) => ({
        time: formatBeijingDateTime(item.timestamp),
        customerNumber: customerNumber(item.customerNumber),
        country: displayCountry(item.country),
        device: displayText(item.device),
        browser: displayText(item.browser),
        channel: displayText(item.channel),
        sourcePlatform: displayText(item.sourcePlatform),
        sourceDetail: displayText(item.sourceDetail),
        page: item.page,
        customerType: customerType(item),
        visitDay: visitDay(item),
        ip: item.ip || "-"
      })),
    [filteredVisitors]
  );
  const countryOptions = useMemo(
    () => [...new Set(visitors.map((visitor) => visitor.country).filter(Boolean))].sort(),
    [visitors]
  );

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
    visitorPager.resetPage();
  }

  return (
    <>
      <LiveSyncNote state={state} />
      <StorageAlert storageMode={data.storageMode} />
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p className="eyebrow">实时访客</p>
            <h2>最近访问记录</h2>
          </div>
          <CsvExportButton rows={csvRows} filename="cowin-visitors.csv" />
        </div>
        <div className="admin-filter-bar admin-filter-bar-compact">
          <input
            aria-label="筛选访客记录"
            value={filters.keyword}
            onChange={(event) => updateFilter("keyword", event.target.value)}
            placeholder="搜索客户编号、页面、IP、来源"
          />
          <select aria-label="按国家筛选" value={filters.country} onChange={(event) => updateFilter("country", event.target.value)}>
            <option value="">全部国家</option>
            {countryOptions.map((country) => (
              <option value={country.toLowerCase()} key={country}>{displayCountry(country)}</option>
            ))}
          </select>
          <input
            aria-label="按来源筛选"
            value={filters.source}
            onChange={(event) => updateFilter("source", event.target.value)}
            placeholder="来源 / 平台"
          />
          <button type="button" onClick={() => { setFilters({ keyword: "", country: "", source: "" }); visitorPager.resetPage(); }}>清空</button>
        </div>
        {visitorPager.pageRows.length ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>时间</th><th>客户编号</th><th>国家</th><th>设备</th><th>浏览器</th><th>来源</th><th>来源平台</th><th>来源详情</th><th>页面</th><th>客户标签</th><th>访问日</th><th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorPager.pageRows.map((visitor, index) => (
                    <tr key={`${visitor.sessionId}-${visitor.timestamp}-${index}`}>
                      <td>{formatBeijingDateTime(visitor.timestamp)}</td>
                      <td>{customerNumber(visitor.customerNumber)}</td>
                      <td>{displayCountry(visitor.country)}</td>
                      <td>{displayText(visitor.device)}</td>
                      <td>{displayText(visitor.browser)}</td>
                      <td>{displayText(visitor.channel)}</td>
                      <td>{displayText(visitor.sourcePlatform)}</td>
                      <td>{displayText(visitor.sourceDetail)}</td>
                      <td>{visitor.page}</td>
                      <td><span className={`admin-customer-tag ${visitor.visitDayNumber === 1 ? "new" : "returning"}`}>{customerType(visitor)}</span></td>
                      <td>{visitDay(visitor)}</td>
                      <td>{visitor.ip || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls {...visitorPager} />
          </>
        ) : (
          <div className="admin-empty">没有符合当前筛选条件的访客记录。</div>
        )}
      </section>
    </>
  );
}

export function AdminPagesRealtime({ initialData }) {
  const { data, state } = useLiveAnalytics(initialData);
  const pages = list(data.pages);
  const landingJourneys = list(data.landingJourneys);
  const [pageFilters, setPageFilters] = useState({ keyword: "" });
  const [journeyFilters, setJourneyFilters] = useState({ keyword: "", country: "", source: "" });
  const totalViews = pages.reduce((sum, page) => sum + Number(page.views || 0), 0);
  const filteredPages = useMemo(() => {
    const keyword = pageFilters.keyword.trim().toLowerCase();
    return pages.filter((page) => {
      if (!keyword) return true;
      return searchableText(page.title, page.page, page.views, page.visitors, page.conversionRate).includes(keyword);
    });
  }, [pages, pageFilters]);
  const pagePager = usePagedRows(pages, filteredPages);
  const filteredLandingJourneys = useMemo(() => {
    const keyword = journeyFilters.keyword.trim().toLowerCase();
    const country = journeyFilters.country.trim().toLowerCase();
    const source = journeyFilters.source.trim().toLowerCase();

    return landingJourneys.filter((item) => {
      const rowText = searchableText(
        formatBeijingDateTime(item.timestamp),
        customerNumber(item.customerNumber),
        customerType(item),
        visitDay(item),
        item.pageTitle,
        item.page,
        item.previousPage,
        item.channel,
        item.sourcePlatform,
        item.sourceDetail,
        item.country,
        item.device,
        item.visitorId
      );
      if (keyword && !rowText.includes(keyword)) return false;
      if (country && String(item.country || "").toLowerCase() !== country) return false;
      if (source && !searchableText(item.channel, item.sourcePlatform, item.sourceDetail).includes(source)) return false;
      return true;
    });
  }, [landingJourneys, journeyFilters]);
  const landingPager = usePagedRows(landingJourneys, filteredLandingJourneys);
  const landingCsvRows = useMemo(
    () =>
      filteredLandingJourneys.map((item) => ({
        time: formatBeijingDateTime(item.timestamp),
        customerNumber: customerNumber(item.customerNumber),
        customerType: customerType(item),
        visitDay: visitDay(item),
        currentPage: item.pageTitle || item.page,
        previousPage: item.previousPage,
        channel: displayText(item.channel),
        sourcePlatform: displayText(item.sourcePlatform),
        country: displayCountry(item.country),
        device: displayText(item.device),
        visitorId: item.visitorId || "-"
      })),
    [filteredLandingJourneys]
  );
  const landingCountryOptions = useMemo(
    () => [...new Set(landingJourneys.map((item) => item.country).filter(Boolean))].sort(),
    [landingJourneys]
  );

  function updatePageFilter(value) {
    setPageFilters({ keyword: value });
    pagePager.resetPage();
  }

  function updateJourneyFilter(key, value) {
    setJourneyFilters((current) => ({ ...current, [key]: value }));
    landingPager.resetPage();
  }

  return (
    <>
      <LiveSyncNote state={state} />
      <section className="admin-grid four">
        <MetricCard label="追踪页面" value={pages.length} note="活跃 URL" />
        <MetricCard label="总浏览量" value={totalViews.toLocaleString()} note="所有页面" />
        <MetricCard label="最佳页面" value={pages[0]?.views || 0} note={pages[0]?.title || "暂无数据"} />
        <MetricCard label="转化率" value={`${pages[0]?.conversionRate || 0}%`} note="热门页面" />
      </section>
      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">页面筛选</p>
            <h2>落地页数据表现</h2>
            <p>默认每页 10 条，可搜索页面标题、URL，并切换每页 20 或 50 条。</p>
          </div>
          <span className="admin-result-count">{filteredPages.length} / {pages.length} 条</span>
        </div>
        <div className="admin-filter-bar admin-filter-bar-compact">
          <input
            aria-label="筛选页面表现"
            value={pageFilters.keyword}
            onChange={(event) => updatePageFilter(event.target.value)}
            placeholder="搜索页面标题或 URL"
          />
          <button type="button" onClick={() => updatePageFilter("")}>清空</button>
        </div>
        {pagePager.pageRows.length ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>页面</th><th>URL</th><th>浏览</th><th>访客</th><th>平均停留</th><th>询盘率</th></tr></thead>
                <tbody>
                  {pagePager.pageRows.map((page) => (
                    <tr key={page.page}><td>{page.title}</td><td>{page.page}</td><td>{page.views}</td><td>{page.visitors}</td><td>{page.avgDuration}s</td><td>{page.conversionRate}%</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls {...pagePager} />
          </>
        ) : (
          <div className="admin-empty">没有符合当前筛选条件的页面数据。</div>
        )}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">行为轨迹标签</p>
            <h2>新老客户与访问日次数</h2>
            <p>同一访客在同一天多次浏览只算第 1 个访问日；隔天再次访问才累计为第 2 次访问日。</p>
          </div>
          <div className="admin-panel-actions">
            <span className="admin-result-count">{filteredLandingJourneys.length} / {landingJourneys.length} 条</span>
            <CsvExportButton rows={landingCsvRows} filename="cowin-landing-journeys.csv" />
          </div>
        </div>
        <div className="admin-filter-bar admin-filter-bar-compact">
          <input
            aria-label="筛选访问明细"
            value={journeyFilters.keyword}
            onChange={(event) => updateJourneyFilter("keyword", event.target.value)}
            placeholder="搜索客户编号、页面、访客ID"
          />
          <select aria-label="按国家筛选访问明细" value={journeyFilters.country} onChange={(event) => updateJourneyFilter("country", event.target.value)}>
            <option value="">全部国家</option>
            {landingCountryOptions.map((country) => (
              <option value={country.toLowerCase()} key={country}>{displayCountry(country)}</option>
            ))}
          </select>
          <input
            aria-label="按来源筛选访问明细"
            value={journeyFilters.source}
            onChange={(event) => updateJourneyFilter("source", event.target.value)}
            placeholder="来源 / 平台"
          />
          <button type="button" onClick={() => { setJourneyFilters({ keyword: "", country: "", source: "" }); landingPager.resetPage(); }}>清空</button>
        </div>
        {landingPager.pageRows.length ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>时间</th><th>客户编号</th><th>客户标签</th><th>访问日</th><th>当前页面</th><th>上一页</th><th>来源</th><th>来源平台</th><th>国家</th><th>设备</th><th>访客ID</th></tr></thead>
                <tbody>
                  {landingPager.pageRows.map((item, index) => (
                    <tr key={`${item.visitorId}-${item.timestamp}-${index}`}>
                      <td>{formatBeijingDateTime(item.timestamp)}</td>
                      <td>{customerNumber(item.customerNumber)}</td>
                      <td><span className={`admin-customer-tag ${item.visitDayNumber === 1 ? "new" : "returning"}`}>{customerType(item)}</span></td>
                      <td>{visitDay(item)}</td>
                      <td>{item.pageTitle}</td>
                      <td>{item.previousPage}</td>
                      <td>{displayText(item.channel)}</td>
                      <td>{displayText(item.sourcePlatform)}</td>
                      <td>{displayCountry(item.country)}</td>
                      <td>{displayText(item.device)}</td>
                      <td>{item.visitorId?.slice(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls {...landingPager} />
          </>
        ) : (
          <div className="admin-empty">没有符合当前筛选条件的访问明细。</div>
        )}
      </section>
    </>
  );
}

export function AdminJourneysRealtime({ initialData }) {
  const { data, state } = useLiveAnalytics(initialData);
  const journeys = list(data.journeys);
  const [filters, setFilters] = useState({ keyword: "", from: "", to: "" });
  const filteredJourneys = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const from = filters.from.trim().toLowerCase();
    const to = filters.to.trim().toLowerCase();

    return journeys.filter((item) => {
      const route = String(item.route || "");
      const [routeFrom = "", routeTo = ""] = route.split(" -> ");
      const routeText = route.toLowerCase();
      if (keyword && !routeText.includes(keyword)) return false;
      if (from && !routeFrom.toLowerCase().includes(from)) return false;
      if (to && !routeTo.toLowerCase().includes(to)) return false;
      return true;
    });
  }, [journeys, filters]);
  const journeyPager = usePagedRows(journeys, filteredJourneys);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
    journeyPager.resetPage();
  }

  function clearFilters() {
    setFilters({ keyword: "", from: "", to: "" });
    journeyPager.resetPage();
  }

  return (
    <>
      <LiveSyncNote state={state} />
      <section className="admin-panel">
        {journeys.length ? (
          <>
            <div className="admin-panel-headline">
              <div>
                <p className="eyebrow">路径筛选</p>
                <h2>访问路径明细</h2>
                <p>默认每页 10 条，可按完整路径、来源页或目标页快速筛选，并切换 20 或 50 条每页。</p>
              </div>
              <span className="admin-result-count">{filteredJourneys.length} / {journeys.length} 条</span>
            </div>
            <div className="admin-filter-bar admin-filter-bar-journeys">
              <input
                aria-label="按完整路径筛选"
                value={filters.keyword}
                onChange={(event) => updateFilter("keyword", event.target.value)}
                placeholder="搜索完整路径，例如 products 或 contact"
              />
              <input
                aria-label="按来源页面筛选"
                value={filters.from}
                onChange={(event) => updateFilter("from", event.target.value)}
                placeholder="来源页"
              />
              <input
                aria-label="按目标页面筛选"
                value={filters.to}
                onChange={(event) => updateFilter("to", event.target.value)}
                placeholder="目标页"
              />
              <button type="button" onClick={clearFilters}>清空</button>
            </div>
            {journeyPager.pageRows.length ? (
              <>
                <BarList rows={journeyPager.pageRows.map((item) => ({ label: item.route, value: item.value }))} />
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr><th>来源页面</th><th>目标页面</th><th>次数</th></tr>
                    </thead>
                    <tbody>
                      {journeyPager.pageRows.map((item) => {
                        const [from = "-", to = "-"] = String(item.route || "").split(" -> ");
                        return (
                          <tr key={item.route}>
                            <td>{from}</td>
                            <td>{to}</td>
                            <td>{item.value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <PaginationControls {...journeyPager} />
              </>
            ) : (
              <div className="admin-empty">没有符合当前筛选条件的访问路径。</div>
            )}
          </>
        ) : (
          <div className="admin-empty">当访客在同一个会话中浏览多个页面后，这里会自动生成访问路径数据。</div>
        )}
      </section>
    </>
  );
}
