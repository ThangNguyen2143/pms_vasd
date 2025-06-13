import { Suspense } from "react";
import ClientStatisticalPage from "./client-statistical";

function StatisticalPage() {
  return (
    <Suspense fallback={<div>Đang tải thống kê...</div>}>
      <ClientStatisticalPage />
    </Suspense>
  );
}

export default StatisticalPage;
