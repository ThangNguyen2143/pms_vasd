export const status_with_color = (status: string) => {
  switch (status) {
    case "DONE":
    case "COMPLETED":
      return "success";
    case "NEW":
      return "secondary";
    case "CANCELED":
      return "neutral";
    case "FAILED":
    case "REJECTED":
      return "error";
    case "INPROGRESS":
    case "IN_PROGRESS":
      return "info";
    case "WAITING_REVIEW":
    case "ASSIGNED":
      return "accent";
    case "ON_HOLD":
      return "warning";
    default:
      return "ghost";
  }
};
// [
//   {
//     code: "WAITING_REVIEW",
//     display: "Chờ đánh giá",
//   },
//   {
//     code: "ON_HOLD",
//     display: "Tạm dừng",
//   },
// ];
