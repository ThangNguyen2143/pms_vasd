import { Wrench } from "lucide-react";
import { TestcaseDetail } from "~/lib/types";

function TestcaseInfo({
  testcase,
  openUpdate,
}: {
  testcase: TestcaseDetail;
  openUpdate: () => void;
}) {
  return (
    <div className="bg-base-100 shadow p-4 rounded-lg">
      <div className="flex justify-between border-l-4 border-green-500 pl-3">
        <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
        <button
          className="btn btn-outline btn-info tooltip"
          data-tip={"Cập nhật thông tin"}
          onClick={openUpdate}
        >
          <Wrench />
        </button>
      </div>

      <div className="space-y-3">
        <p>
          <strong>Tên:</strong> {testcase.name}
        </p>
        <p>
          <strong>Mô tả:</strong> {testcase.description}
        </p>
        <p>
          <strong>Tags:</strong>
          {testcase.tags.map((tag) => (
            <span key={tag} className="badge badge-primary ml-2">
              {tag}
            </span>
          ))}
        </p>
        <p>
          <strong>Môi trường:</strong> {testcase.environment}
        </p>
        <p>
          <strong>Ngày tạo:</strong>{" "}
          {new Date(testcase.create_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {testcase.time_end
            ? new Date(testcase.time_end).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Đầu vào:</strong> {testcase.test_data || "-"}
        </p>
      </div>
    </div>
  );
}

export default TestcaseInfo;
