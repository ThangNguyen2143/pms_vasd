"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { TaskDTO } from "~/lib/types";

function LinkTaskOrTestToBugModal({
  bug_id,
  product_id,
  onClose,
  onUpdate,
}: {
  bug_id: number;
  product_id: string;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [selectType, setSelectType] = useState<string>("");
  const { data: taskList, getData: getTask, errorData } = useApi<TaskDTO[]>();
  const [selectData, setSelectData] = useState<number>(0);
  const {
    putData,
    isLoading,
    errorData: errorPut,
  } = useApi<string, { type: string; bug_id: number; ref_id: number }>();
  // const {data:testcaseList, getData:getTestcase, isLoading:isLoadTestcase} = useApi<TaskDTO>()
  useEffect(() => {
    getTask("/tasks/" + encodeBase64({ product_id }), "no-cache");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  useEffect(() => {
    if (errorPut) toast.error(errorPut.message || errorPut.title);
  }, [errorPut]);
  const handleSubmit = async () => {
    if (selectData == 0) {
      toast.warning("Vui lòng chọn liên kết");
      return;
    }
    const re = await putData("/bugs/ref", {
      type: selectType,
      bug_id,
      ref_id: selectData,
    });
    if (re != "") return;
    toast.success("Xử lý thành công");
    await onUpdate();
    onClose();
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box w-1/4">
        <h3 className="font-bold text-lg">Liên kết task/testcase</h3>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Loại</legend>
          <select
            className="select"
            value={selectType}
            onChange={(e) => setSelectType(e.target.value)}
          >
            <option value={""} disabled>
              Chọn loại liên kết
            </option>
            <option value="test">Testcase</option>
            <option value="task">Task</option>
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Liên kết</legend>
          <select
            name="ref_id"
            className="select"
            value={selectData}
            onChange={(e) => setSelectData(parseInt(e.target.value))}
          >
            <option value={0}>Danh sách </option>
            {taskList &&
              selectType == "task" &&
              taskList.map((task) => {
                return (
                  <option value={task.id} key={task.id + "task"}>
                    {task.title}
                  </option>
                );
              })}
          </select>
        </fieldset>
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Xác nhận
          </button>
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkTaskOrTestToBugModal;
