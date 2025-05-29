"use client";
import AddProductBtn from "./add-product";
import ProductTable from "./product-table";

function MainProductTable({ project_id }: { project_id: number }) {
  // const [projectId, setprojectId] = useState(project_id);
  // Lấy projectSelected từ localStorage khi component mount
  // useEffect(() => {
  //   const saved = sessionStorage.getItem("projectSelected");
  //   if (saved) setprojectId(parseInt(saved));
  // }, []);
  // // Lưu mỗi khi projectSelected thay đổi
  // useEffect(() => {
  //   if (projectId !== 0) {
  //     sessionStorage.setItem("projectSelected", projectId.toString());
  //   }
  // }, [projectId]);
  return (
    <div className="flex flex-col gap-4 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between gap-2">
        <h2 className="text-2xl font-bold">Danh sách phần mềm</h2>
        {/* <LitsProject project_id={projectId} setProjectId={setprojectId} /> */}
        <AddProductBtn project_id={project_id} />
      </div>
      <ProductTable project_id={project_id} />
    </div>
  );
}

export default MainProductTable;
