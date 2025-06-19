import { Suspense } from "react";
import ClientIncidentPage from "./client";

function IncidentReportPage() {
  return (
    <div className="container p-2 mx-auto">
      <h1 className="text-4xl font-bold">Danh sách sự cố/sự kiện</h1>
      <Suspense fallback={<div>Đang tải dữ liệu...</div>}>
        <ClientIncidentPage />
      </Suspense>
    </div>
  );
}

export default IncidentReportPage;
