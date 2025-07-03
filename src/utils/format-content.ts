import { format_date } from "./fomat-date";

export function formatContent(content: string): string {
  const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} (AM|PM))/g;

  return content.replace(dateRegex, (match) => {
    const parsed = new Date(match);
    // Nếu parse không thành công thì trả lại chuỗi gốc
    if (isNaN(parsed.getTime())) return match;
    return format_date(match); // hoặc format_date(parsed.toISOString())
  });
}
