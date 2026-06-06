"use client";

import { useMemo, useState } from "react";
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
  const isCustom = preset === "custom";

  const helperText = useMemo(() => {
    if (isCustom) return "自定义查询时间最长 2 年";
    return `当前查看：${range?.label || "最近 7 天"}，${range?.startInput} 至 ${range?.endInput}`;
  }, [isCustom, range]);

  function applyRange(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set("range", preset);
    if (preset === "custom") {
      params.set("start", start);
      params.set("end", end);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form className="admin-date-filter" onSubmit={applyRange}>
      <div className="admin-date-filter-head">
        <span>时间范围</span>
        <small>{helperText}</small>
      </div>
      <div className="admin-date-presets" role="group" aria-label="选择时间范围">
        {rangeOptions.map(([value, label]) => (
          <button
            type="button"
            className={preset === value ? "is-active" : ""}
            aria-pressed={preset === value}
            onClick={() => setPreset(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="admin-date-native-select">
        <span>快捷选择</span>
        <select value={preset} onChange={(event) => setPreset(event.target.value)}>
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
            <input type="date" value={start} max={end || range?.endInput} onChange={(event) => setStart(event.target.value)} />
          </label>
          <label>
            <span>结束</span>
            <input type="date" value={end} max={range?.endInput} onChange={(event) => setEnd(event.target.value)} />
          </label>
        </div>
      ) : null}
      <button className="admin-date-submit" type="submit">查询</button>
    </form>
  );
}
