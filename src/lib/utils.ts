import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";

/**
 * Merges Tailwind and conditional class names cleanly
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format amounts into Bangladeshi Taka (৳) with proper locale formatting
 */
export function formatBDT(amount: number): string {
  if (isNaN(amount)) return "৳0";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("BDT", "৳")
    .trim();
}

/**
 * Format dates safely with a fallback
 */
export function formatDate(
  date: string | number | Date | null | undefined,
  pattern = "dd MMM yyyy"
): string {
  if (!date) return "-";
  const parsed = new Date(date);
  if (!isValid(parsed)) return "-";
  return format(parsed, pattern);
}

/**
 * Format datetime safely with fallback
 */
export function formatDateTime(
  date: string | number | Date | null | undefined,
  pattern = "dd MMM yyyy, hh:mm a"
): string {
  if (!date) return "-";
  const parsed = new Date(date);
  if (!isValid(parsed)) return "-";
  return format(parsed, pattern);
}

/**
 * Convert English digits to Bengali digits (e.g. 123 -> ১২৩)
 */
export function toBengaliNumber(value: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(value).replace(/[0-9]/g, (digit) => bengaliDigits[Number(digit)]);
}

/**
 * Truncate long strings with ellipsis
 */
export function truncate(text: string, length = 60): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}
