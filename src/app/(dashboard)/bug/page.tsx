import BugsClient from "~/components/bugs/bugs-client";

export const metadata = {
  title: "Bugs",
  description: "Danh sách bug trên phần mềm",
};

function BugsPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">Danh sách bugs</h1>
      <BugsClient />
    </main>
  );
}

export default BugsPage;
