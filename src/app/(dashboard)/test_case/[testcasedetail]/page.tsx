import { decodeBase64 } from "~/lib/services";
import TestcaseDetailClient from "./testcase-detail-client";

async function TestcaseDetailPage(prop: {
  params: Promise<{ testcasedetail: string }>;
}) {
  const { testcasedetail } = await prop.params;
  const testcasedecode: { testcase_id: number } = decodeBase64(
    decodeURIComponent(testcasedetail)
  ) as {
    testcase_id: number;
  };
  return <TestcaseDetailClient testcase_id={testcasedecode.testcase_id} />;
}

export default TestcaseDetailPage;
