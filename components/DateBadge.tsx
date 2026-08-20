import { formatDisplayDate } from "@/data/contentHub";

type DateBadgeProps = {
  date: string;
  className?: string;
};

export function DateBadge({ date, className = "" }: DateBadgeProps) {
  const normalized = String(date || "");
  const value = new Date(normalized.includes("T") ? normalized : `${normalized}T00:00:00Z`);
  const month = value.toLocaleDateString("en", { month: "short", timeZone: "UTC" });
  const day = value.toLocaleDateString("en", { day: "2-digit", timeZone: "UTC" });
  const year = value.toLocaleDateString("en", { year: "numeric", timeZone: "UTC" });

  return (
    <time className={`date-badge ${className}`.trim()} dateTime={date} aria-label={formatDisplayDate(date)}>
      <span>{month}</span>
      <strong>{day}</strong>
      <small>{year}</small>
    </time>
  );
}
