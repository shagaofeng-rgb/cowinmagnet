"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

const rangeOptions = [
  ["day", "日"],
  ["week", "周"],
  ["month", "月"],
  ["year", "年"],
  ["custom", "自定义"]
];

export default function AdminDateRangeFilter({ range }) {
  const router = useRouter();
  const pathname = usePathname();
  const [preset, setPreset] = useState(range?.preset || "week");
  const [start, setStart] = useState(range?.startInput || "");
  const [end, setEnd] = useState(range?.endInput || "");
  const [isPending, startTransition] = useTransition();
  const isCustom = preset === "custom";

  const helperText = useMemo(() => {
    if (isCustom) return "自定义查询时间最长 2 年";
    return `当前查看：${range?.label || "最近 7 天"}，${range?.startInput} 至 ${range?.endInput}`;
  }, [isCustom, range]);

  function queryRange(nextPreset = preset, nextStart = start, nextEnd = end) {
    const params = new URLSearchParams();
    params.set("range", nextPreset);
    if (nextPreset === "custom") {
      params.set("start", nextStart || range?.startInput || "");
      params.set("end", nextEnd || range?.endInput || "");
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    });
  }

  function applyRange(event) {
    event.preventDefault();
    queryRange();
  }

  function choosePreset(value) {
    setPreset(value);
    if (value === "custom") return;
    queryRange(value);
  }

  return (
    <form className="admin-date-filter" onSubmit={applyRange}>
      <div className="admin-date-filter-head">
        <span>时间范围</span>
        <small>{isPending ? "正在查询最新数据..." : helperText}</small>
      </div>
      <div className="admin-date-presets" role="group" aria-label="选择时间范围">
        {rangeOptions.map(([value, label]) => (
          <button
            type="button"
            className={preset === value ? "is-active" : ""}
            aria-pressed={preset === value}
            onClick={() => choosePreset(value)}
            disabled={isPending}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="admin-date-native-select">
        <span>快捷选择</span>
        <select value={preset} onChange={(event) => choosePreset(event.target.value)} disabled={isPending}>
          {rangeOptions.map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {isCustom ? (
        <div className="admin-date-custom-fields">
          <label>
            <span>开始</span>
            <input type="date" value={start} max={end || range?.endInput} onChange={(event) => setStart(event.target.value)} disabled={isPending} />
          </label>
          <label>
            <span>结束</span>
            <input type="date" value={end} max={range?.endInput} onChange={(event) => setEnd(event.target.value)} disabled={isPending} />
          </label>
        </div>
      ) : null}
      <button className="admin-date-submit" type="submit" disabled={isPending}>
        {isPending ? "查询中..." : isCustom ? "查询自定义时间" : "刷新当前范围"}
      </button>
    </form>
  );
}
