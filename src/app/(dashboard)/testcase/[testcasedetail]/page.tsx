import { decodeBase64 } from "~/lib/services";
import TestcaseDetailClient from "./testcase-detail-client";

async function TestcaseDetailPage(prop: {
  params: Promise<{ testcasedetail: string }>;
}) {
  const { testcasedetail } = await prop.params;
  const testcasedecode: { testcase_id: number; product_id: string } =
    decodeBase64(decodeURIComponent(testcasedetail)) as {
      testcase_id: number;
      product_id: string;
    };
  return (
    <TestcaseDetailClient
      testcase_id={testcasedecode.testcase_id}
      product_id={testcasedecode.product_id}
    />
  );
}

export default TestcaseDetailPage;
