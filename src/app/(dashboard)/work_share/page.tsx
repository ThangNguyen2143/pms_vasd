import MainWork from "~/components/work-share";

export const metadata = {
  title: "Theo dõi tiến độ",
  description: "Theo dõi tiến độ dự án",
};
async function WorkSharePage() {
  return (
    <div className="container p-2 mx-auto">
      <h1 className="text-4xl font-bold">Theo dõi tiến độ</h1>
      <MainWork />
    </div>
  );
}

export default WorkSharePage;
