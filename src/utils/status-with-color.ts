export const status_with_color_badge: Record<string, string> = {
  // ✅ Đã xử lý xong
  PROCESSED: "badge badge-success badge-outline",
  CLOSED: "badge badge-success",
  DONE: "badge badge-success",
  COMPLETED: "badge badge-success",

  // 🔄 Đang xử lý
  INPROGRESS: "badge badge-accent",
  IN_PROGRESS: "badge badge-accent",
  PASSED: "badge badge-accent",

  // ✅ Đã tiếp nhận
  ACCEPTED: "badge badge-info badge-soft",

  // ⏳ Trì hoãn
  DELAY: "badge badge-secondary badge-dashed",

  // ⚠️ Cần làm rõ
  CLARIFY: "badge badge-info badge-outline",

  // 🆕 Mới tạo
  NEW: "badge badge-secondary badge-outline ",
  DRAFT: "badge badge-neutral",

  // ❌ Lỗi hoặc bị từ chối
  REJECTED: "badge badge-error",
  FAILED: "badge badge-error badge-outline",
  UNABLE_TO_PROCESS: "badge badge-error badge-soft",
  CONFLICT: "badge badge-error badge-outline",

  // 👀 Đang review hoặc phân công
  WAITING_REVIEW: "badge badge-info badge-soft",
  ASSIGNED: "badge badge-info",
  CONFIRMED: "badge badge-info",

  // 🚫 Huỷ bỏ hoặc không cần xử lý nữa
  CANCELED: "badge badge-neutral badge-dashed",
  READY: "badge badge-neutral badge-outline",
  RESOLVED: "badge badge-neutral",

  // ⏸️ Tạm hoãn
  ON_HOLD: "badge badge-warning badge-outline",
};

export const status_color_btn: Record<string, string> = {
  // ✅ Thành công, đã hoàn thành
  CLOSED: "success",
  PROCESSED: "success",

  // 🕒 Đang xử lý
  INPROGRESS: "info",
  IN_PROGRESS: "info",

  // 📨 Đã tiếp nhận nhưng chưa xử lý
  ACCEPTED: "accent",
  DELAY: "accent",

  // 🆕 Mới, nháp
  NEW: "secondary",

  // 📋 Cần làm rõ hoặc xác nhận
  CLARIFY: "warning",

  // ❌ Từ chối, lỗi
  REJECTED: "error",
  FAILED: "error",
  UNABLE_TO_PROCESS: "error",
  CONFLICT: "error",

  // 🚫 Đã huỷ
  CANCELED: "neutral",

  // Trạng thái mặc định nếu không khớp
  DEFAULT: "base-200",
};
