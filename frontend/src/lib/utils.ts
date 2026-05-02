import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initialName(name: string): string {
  const allNames = name.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
}

export function titleCase(s: string): string {
  return s.replace(/^_*(.)|_+(.)/g, (_, c, d) => (c ? c.toUpperCase() : " " + d.toUpperCase()));
}
