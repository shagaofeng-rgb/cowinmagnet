"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

const rangeOptions = [
  ["day", "日"],
  ["week", "周"],
  ["month", "月"],
  ["custom", "自定义"]
];

export default function AdminDateRangeFilter({ range }) {
  const router = useRouter();
  const pathname = usePathname();
  const customPanelRef = useRef(null);
  const [preset, setPreset] = useState(range?.preset || "day");
  const [start, setStart] = useState(range?.startInput || "");
  const [end, setEnd] = useState(range?.endInput || "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isCustom = preset === "custom";

  useEffect(() => {
    setPreset(range?.preset || "day");
    setStart(range?.startInput || "");
    setEnd(range?.endInput || "");
    setError("");
  }, [range?.preset, range?.startInput, range?.endInput]);

  useEffect(() => {
    if (!isCustom) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setPreset(range?.preset === "custom" ? "day" : range?.preset || "day");
        setError("");
      }
    }

    function closeOnOutsideClick(event) {
      if (customPanelRef.current && !customPanelRef.current.contains(event.target)) {
        if (range?.preset !== "custom") setPreset(range?.preset || "day");
        setError("");
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [isCustom, range?.preset]);

  const helperText = useMemo(() => {
    if (error) return error;
    if (isCustom) return `自定义查询最长 ${range?.maxCustomDays || 731} 天`;
    return `当前查看：${range?.label || "今日"}，${range?.startInput || "-"} 至 ${range?.endInput || "-"}`;
  }, [error, isCustom, range]);

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

  function validateCustomRange() {
    if (!start || !end) return "请选择开始日期和结束日期";
    if (start > end) return "结束日期不能早于开始日期";
    if (range?.endInput && end > range.endInput) return "结束日期不能晚于今天";
    return "";
  }

  function applyRange(event) {
    event.preventDefault();
    if (preset === "custom") {
      const nextError = validateCustomRange();
      setError(nextError);
      if (nextError) return;
    }
    queryRange();
  }

  function choosePreset(value) {
    setPreset(value);
    setError("");
    if (value === "custom") return;
    queryRange(value);
  }

  function clearCustomRange() {
    setStart(range?.startInput || "");
    setEnd(range?.endInput || "");
    setError("");
    choosePreset("day");
  }

  return (
    <form className="admin-date-filter" onSubmit={applyRange}>
      <div className="admin-date-filter-head">
        <span>时间范围</span>
        <small className={error ? "is-error" : ""}>
          {isPending ? "正在查询最新数据..." : helperText}
        </small>
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
        <div className="admin-date-custom-fields" ref={customPanelRef}>
          <label>
            <span>开始</span>
            <input
              type="date"
              value={start}
              max={end || range?.endInput}
              onChange={(event) => {
                setStart(event.target.value);
                setError("");
              }}
              disabled={isPending}
            />
          </label>
          <label>
            <span>结束</span>
            <input
              type="date"
              value={end}
              min={start || undefined}
              max={range?.endInput}
              onChange={(event) => {
                setEnd(event.target.value);
                setError("");
              }}
              disabled={isPending}
            />
          </label>
          <button type="button" className="admin-date-clear" onClick={clearCustomRange} disabled={isPending}>
            清除
          </button>
        </div>
      ) : null}
      <button className="admin-date-submit" type="submit" disabled={isPending}>
        {isPending ? "查询中..." : isCustom ? "应用自定义时间" : "刷新当前范围"}
      </button>
    </form>
  );
}
