import { format } from "date-fns";
export function format_date(date: string): string {
  return format(new Date(date), "HH:mm:ss dd/MM/yyyy");
}
export function toISOString(date: string) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}
