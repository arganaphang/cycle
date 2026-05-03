/** Pad number to two digits for time / datetime-local segments. */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Value suitable for `datetime-local` parsing and `new Date()` in the browser. */
export function toDatetimeLocalString(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
