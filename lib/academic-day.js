import { PRACTICE_RESET_TZ } from "./config";

function partsInZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const bits = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(bits.year),
    month: Number(bits.month),
    day: Number(bits.day),
    hour: Number(bits.hour),
  };
}

function shiftCalendarDay(year, month, day, delta) {
  const utc = new Date(Date.UTC(year, month - 1, day + delta));
  return utc.toISOString().slice(0, 10);
}

export function getAcademicDay(now = new Date(), timeZone = PRACTICE_RESET_TZ) {
  const { year, month, day, hour } = partsInZone(now, timeZone);
  const calendar = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (hour < 12) {
    return shiftCalendarDay(year, month, day, -1);
  }
  return calendar;
}

export function nextResetIso(now = new Date(), timeZone = PRACTICE_RESET_TZ) {
  const { year, month, day, hour } = partsInZone(now, timeZone);
  const daysAhead = hour < 12 ? 0 : 1;
  const next = shiftCalendarDay(year, month, day, daysAhead);
  return `${next}T12:00:00`;
}
