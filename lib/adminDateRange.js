const maxCustomDays = 731;

const presetDays = {
  day: 1,
  week: 7,
  month: 30,
  year: 365
};

const presetLabels = {
  day: "今日",
  week: "本周",
  month: "本月",
  year: "本年",
  custom: "自定义"
};

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function addDays(date, days) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
}

function dateInput(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function parseDateInput(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const date = new Date(`${value}T00:00:00+08:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeSearchParams(searchParams) {
  if (!searchParams) return {};
  if (searchParams instanceof URLSearchParams) return Object.fromEntries(searchParams.entries());
  return searchParams;
}

export function getAdminDateRange(searchParams) {
  const params = normalizeSearchParams(searchParams);
  const now = new Date();
  const todayEnd = endOfDay(now);
  const requestedPreset = params.range || "week";
  const preset = requestedPreset in presetDays || requestedPreset === "custom" ? requestedPreset : "week";

  let startDate;
  let endDate;

  if (preset === "custom") {
    const parsedStart = parseDateInput(params.start);
    const parsedEnd = parseDateInput(params.end);
    endDate = endOfDay(parsedEnd || now);
    if (endDate > todayEnd) endDate = todayEnd;
    startDate = startOfDay(parsedStart || addDays(endDate, -29));
    const earliestAllowed = startOfDay(addDays(endDate, -(maxCustomDays - 1)));
    if (startDate < earliestAllowed) startDate = earliestAllowed;
    if (startDate > endDate) startDate = startOfDay(endDate);
  } else {
    const days = presetDays[preset];
    endDate = todayEnd;
    startDate = startOfDay(addDays(endDate, -(days - 1)));
  }

  const days = Math.max(1, Math.ceil((endDate - startDate) / 86400000));

  return {
    preset,
    label: presetLabels[preset],
    startDate,
    endDate,
    startInput: dateInput(startDate),
    endInput: dateInput(endDate),
    days,
    maxCustomDays
  };
}
