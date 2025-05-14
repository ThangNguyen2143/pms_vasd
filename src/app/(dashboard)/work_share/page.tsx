import { toast } from "sonner";
import MainWork from "~/components/work-share";
import { getUser } from "~/lib/dal";

export const metadata = {
  title: "Theo dõi tiến độ",
  description: "Theo dõi tiến độ dự án",
};
async function WorkSharePage() {
  const user = await getUser();
  if (!user) toast.error("Lỗi người dùng");
  return (
    <div className="container p-2 mx-auto">
      <h1 className="text-4xl font-bold">Theo dõi tiến độ</h1>
      <MainWork role={user?.role} />
    </div>
  );
}

export default WorkSharePage;
