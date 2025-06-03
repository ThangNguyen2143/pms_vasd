//Add meta data

import ClientTestCasesPage from "./client-testcase";

function TestcasePage() {
  return (
    <main className="flex flex-col p-24">
      <h1 className="text-2xl text-center font-bold">
        Danh sách trường hợp kiểm thử
      </h1>
      <ClientTestCasesPage />
    </main>
  );
}

export default TestcasePage;
