const maxCustomDays = 731;
const dayMs = 24 * 60 * 60 * 1000;

const presetLabels = {
  day: "今日",
  week: "本周",
  month: "本月",
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

function startOfBeijingWeek(date) {
  const start = startOfBeijingDay(date);
  const day = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Shanghai",
      weekday: "short"
    })
      .format(start)
      .replace("Sun", "0")
      .replace("Mon", "1")
      .replace("Tue", "2")
      .replace("Wed", "3")
      .replace("Thu", "4")
      .replace("Fri", "5")
      .replace("Sat", "6")
  );
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(start, mondayOffset);
}

function startOfBeijingMonth(date) {
  const input = dateInput(date);
  return parseDateInput(`${input.slice(0, 7)}-01`);
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
  const requestedPreset = params.range || "day";
  const preset = requestedPreset in presetLabels ? requestedPreset : "day";

  let startDate;
  let endDate = todayEnd;

  if (preset === "custom") {
    const parsedStart = parseDateInput(params.start);
    const parsedEnd = parseDateInput(params.end);
    endDate = parsedEnd ? endOfBeijingDay(parsedEnd) : todayEnd;
    if (endDate > todayEnd) endDate = todayEnd;
    startDate = parsedStart ? startOfBeijingDay(parsedStart) : startOfBeijingDay(addDays(endDate, -29));
    const earliestAllowed = startOfBeijingDay(addDays(endDate, -(maxCustomDays - 1)));
    if (startDate < earliestAllowed) startDate = earliestAllowed;
    if (startDate > endDate) startDate = startOfBeijingDay(endDate);
  } else if (preset === "day") {
    startDate = startOfBeijingDay(now);
  } else if (preset === "month") {
    startDate = startOfBeijingMonth(now);
  } else {
    startDate = startOfBeijingWeek(now);
  }

  const days = Math.max(1, Math.ceil((endDate - startDate + 1) / dayMs));

  return {
    preset,
    label: presetLabels[preset],
    startDate,
    endDate,
    startInput: dateInput(startDate),
    endInput: dateInput(endDate),
    todayInput: dateInput(todayEnd),
    days,
    maxCustomDays
  };
}
