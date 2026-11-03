import type { EventCategory } from "@/lib/events";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatEventDate(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-BD", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function getTomorrowDate() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function categoryClass(category: EventCategory) {
  return `category-${category.toLowerCase()}`;
}

export function safePhotoUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}
