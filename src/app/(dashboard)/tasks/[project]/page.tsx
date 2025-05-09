/* eslint-disable @typescript-eslint/no-unused-vars */
// import { TaskList } from "~/components/employees";
import { decodeBase64 } from "~/lib/services";

async function TaskByProductPage(prop: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await prop.params;
  const projectdecode: { project_id: number } = decodeBase64(
    decodeURIComponent(project)
  ) as { project_id: number };
  // return (
  //   <div>
  //     <span className="alert alert-info">Đang code....</span>
  //   </div>
  // );
  return (
    <div className="flex flex-col w-full h-full align-middle gap-4">
      <div className="flex flex-row justify-between items-center">
        <p>Danh sách công việc</p>
        <button className="btn btn-info">Tạo việc</button>
      </div>
      <div className="flex flex-row justify-between items-center gap-4">
        <div>
          <label className="input">
            <span className="label">Tìm kiếm</span>
            <input type="text" placeholder="Nhập tên việc" />
          </label>
        </div>
        <div>
          <label className="select">
            <span className="label">Trạng thái</span>
            <select>
              <option>Đang hoạt động</option>
              <option>Đang khóa</option>
            </select>
          </label>
        </div>
      </div>
      {/* <TaskList project_id={projectdecode.project_id} /> */}
      <div>
        <span className="alert alert-info">Đang code....</span>
      </div>
    </div>
  );
}

export default TaskByProductPage;
