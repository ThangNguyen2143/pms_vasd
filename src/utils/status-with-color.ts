export const status_with_color = (status: string) => {
  switch (status) {
    case "DONE":
    case "COMPLETED":
      return "success";
    case "NEW":
    case "DRAFT":
      return "secondary";
    case "CANCELED":
    case "READY":
    case "RESOLVED":
      return "neutral";
    case "FAILED":
    case "REJECTED":
      return "error";
    case "INPROGRESS":
    case "IN_PROGRESS":
    case "PASSED":
      return "info";
    case "WAITING_REVIEW":
    case "ASSIGNED":
    case "CONFIRMED":
      return "accent";
    case "ON_HOLD":
      return "warning";
    default:
      return "base-200";
  }
};
