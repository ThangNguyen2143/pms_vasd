import { Suspense } from "react";
import MainWork from "~/components/work-share";

export const metadata = {
  title: "Theo dõi tiến độ",
  description: "Theo dõi tiến độ dự án",
};
async function WorkSharePage() {
  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-3xl text-center font-bold">Tiến độ dự án</h1>
      <Suspense
        fallback={
          <div>
            Loading <span className="loading loading-dot"></span>
          </div>
        }
      >
        <MainWork />
      </Suspense>
    </div>
  );
}

export default WorkSharePage;
