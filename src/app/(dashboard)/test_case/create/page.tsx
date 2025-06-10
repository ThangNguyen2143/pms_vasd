import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateTestcaseClient from "~/components/testcase/create-testcae-client";

function CreateTestcasePage() {
  return (
    <main className="flex flex-col p-24">
      <div className="grid grid-cols-3">
        <Link className="flex" href="/test_case">
          <ArrowLeft /> <span> Trở lại</span>
        </Link>
        <h3 className="text-2xl font-bold text-center">Tạo testcase</h3>
      </div>
      <div className="card shadow bg-base-200">
        <CreateTestcaseClient />
      </div>
    </main>
  );
}

export default CreateTestcasePage;
