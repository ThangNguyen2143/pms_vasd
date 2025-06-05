// utils/formatCommentDate.ts
import {
  formatDistanceToNow,
  format,
  differenceInDays,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";

export function formatCommentDate(dateStr: string): string {
  const date = parseISO(dateStr);
  const diffInDays = differenceInDays(new Date(), date);

  if (diffInDays > 6) {
    return format(date, "dd/MM/yyyy");
  }

  return formatDistanceToNow(date, { addSuffix: true, locale: vi }); // ví dụ: '2 days ago'
}
