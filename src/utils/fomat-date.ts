import { format, parse, isValid } from "date-fns";

/**
 * Định dạng ngày sang "HH:mm:ss dd/MM/yyyy"
 * @param input - Date hoặc string định dạng "HH:mm:ss dd/MM/yyyy"
 */
export function format_date(input: string | Date): string {
  if (
    typeof input === "string" &&
    /^(\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4})$/.test(input)
  ) {
    return input;
  }
  let date: Date;

  if (typeof input === "string") {
    // Trường hợp: ISO string (2025-05-31T00:00:00) hoặc custom format
    if (input.includes("T")) {
      // ISO string
      date = new Date(input);
    } else {
      // Giả định chuỗi là theo format "yyyy-MM-dd HH:mm:ss"
      date = parse(input, "yyyy-MM-dd HH:mm:ss", new Date());
    }
  } else {
    // Date object
    date = input;
  }
  if (!isValid(date)) {
    throw new Error("Invalid date format in format_date");
  }

  return format(date, "HH:mm:ss dd/MM/yyyy");
}

/**
 * Chuyển về định dạng ISO: "yyyy-MM-dd HH:mm:ss"
 * @param input - Date hoặc string định dạng "HH:mm:ss dd/MM/yyyy"
 */
export function toISOString(input: string | Date): string {
  let date: Date;

  if (typeof input === "string") {
    // parse từ chuỗi có định dạng cụ thể
    date = parse(format_date(input), "HH:mm:ss dd/MM/yyyy", new Date());
  } else {
    date = input;
  }
  if (!isValid(date)) {
    throw new Error("Invalid date format in toISOString");
  }

  return format(date, "yyyy-MM-dd HH:mm:ss");
}
