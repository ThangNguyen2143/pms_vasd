import { format } from "date-fns";
/**
 * Hàm thay đổi định dạng ngày
 * @param date
 * @returns format to HH:mm:ss dd/MM/yyyy
 */
export function format_date(date: string): string {
  return format(date, "HH:mm:ss dd/MM/yyyy");
}
/**
 *  Hàm trả về định dạng ISO chuẩn
 * @param date
 * @returns format: yyyy-MM-dd HH:mm:ss
 */
export function toISOString(date: string | Date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}
