const maxCustomDays = 731;
const dayMs = 24 * 60 * 60 * 1000;

const presetDays = {
  day: 1,
  week: 7,
  month: 30,
  year: 365
};

const presetLabels = {
  day: "今日",
  week: "最近 7 天",
  month: "最近 30 天",
  year: "最近 365 天",
  custom: "自定义"
};

function addDays(date, days) {
  return new Date(date.getTime() + days * dayMs);
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

function startOfBeijingDay(date) {
  return parseDateInput(dateInput(date));
}

function endOfBeijingDay(date) {
  return new Date(startOfBeijingDay(date).getTime() + dayMs - 1);
}

function normalizeSearchParams(searchParams) {
  if (!searchParams) return {};
  if (searchParams instanceof URLSearchParams) return Object.fromEntries(searchParams.entries());
  return searchParams;
}

export function getAdminDateRange(searchParams) {
  const params = normalizeSearchParams(searchParams);
  const now = new Date();
  const todayEnd = endOfBeijingDay(now);
  const requestedPreset = params.range || "week";
  const preset = requestedPreset in presetDays || requestedPreset === "custom" ? requestedPreset : "week";

  let startDate;
  let endDate;

  if (preset === "custom") {
    const parsedStart = parseDateInput(params.start);
    const parsedEnd = parseDateInput(params.end);
    endDate = parsedEnd ? endOfBeijingDay(parsedEnd) : todayEnd;
    if (endDate > todayEnd) endDate = todayEnd;
    startDate = parsedStart ? startOfBeijingDay(parsedStart) : startOfBeijingDay(addDays(endDate, -29));
    const earliestAllowed = startOfBeijingDay(addDays(endDate, -(maxCustomDays - 1)));
    if (startDate < earliestAllowed) startDate = earliestAllowed;
    if (startDate > endDate) startDate = startOfBeijingDay(endDate);
  } else {
    const days = presetDays[preset];
    endDate = todayEnd;
    startDate = startOfBeijingDay(addDays(endDate, -(days - 1)));
  }

  const days = Math.max(1, Math.ceil((endDate - startDate) / dayMs));

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
