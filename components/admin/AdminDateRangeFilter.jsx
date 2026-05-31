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
    if (isCustom) return "自定义时间跨度最多 2 年";
    return `当前查看：${range?.label || "本周"}（${range?.startInput} 至 ${range?.endInput}）`;
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
      <label>
        <span>时间范围</span>
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
      <button type="submit">查询</button>
      <small>{helperText}</small>
    </form>
  );
}
