import GroupTab from "~/components/group";
import AddGroupBtn from "~/components/employees/add-group-btn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý nhóm",
  description: "Trang quản lý nhóm trong công ty",
};

async function GroupPage() {
  return (
    <div className="tabs tabs-box">
      <div className="border-base-300 bg-base-100 p-10 w-full">
        <div className="flex flex-col w-full h-full align-middle gap-4">
          <div className="flex flex-row justify-between items-center">
            <p className="text-2xl font-bold">Danh sách nhóm</p>
            <AddGroupBtn />
          </div>

          <GroupTab />
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
