import { format } from "date-fns";
export function format_date(date: string): string {
  console.log(date);
  return format(date, "HH:mm:ss dd/MM/yyyy");
}
export function toISOString(date: string | Date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}
