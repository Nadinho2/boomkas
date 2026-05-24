import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeFormatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Recently published";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently published";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Recently published";
  }
}
