"use server";
import { Suspense } from "react";
import RequirementsClient from "./requirementClient";

async function RequirementsPage() {
  return (
    <Suspense fallback={<div>Đang tải dữ liệu...</div>}>
      <RequirementsClient />
    </Suspense>
  );
}

export default RequirementsPage;
