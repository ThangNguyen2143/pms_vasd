"use client";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
// import { DateRange, DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementTask } from "~/lib/types";

// let timeout: NodeJS.Timeout;
interface DataPut {
  type: string;
  task_id: number;
  requirement_id: number[];
}
type LinkRequirement = {
  id: number;
  title: string;
};
export default function LinkRequirementModal({
  onClose,
  onUpdate,
  product_id,
  task_id,
  linked,
}: {
  onClose: () => void;
  onUpdate: () => Promise<void>;
  task_id: number;
  product_id: string;
  linked?: RequirementTask[];
}) {
  const { getData } = useApi<LinkRequirement[]>();
  const [requirementList, setRequirementList] = useState<LinkRequirement[]>([]);
  const originalList: LinkRequirement[] =
    linked?.map((linkRe) => ({
      id: linkRe.requirement_id,
      title: linkRe.requirement_title,
    })) || [];

  // const [selectedRequirementId, setSelectedRequirementId] = useState<number>(0);
  const [linkedRequirements, setLinkedRequirements] = useState<
    LinkRequirement[]
  >(
    linked?.map((linkRe) => ({
      id: linkRe.requirement_id,
      title: linkRe.requirement_title,
    })) || []
  );
  const {
    putData: updateLinkRemove,
    isLoading,
    errorData: errorRemove,
  } = useApi<string, DataPut>();

  const { putData: updateLinkAdd, errorData: errorAdd } = useApi<
    string,
    DataPut
  >();
  useEffect(() => {
    getData(
      "/requirements/list/" + encodeBase64({ product_id }),
      "reload"
    ).then((res) => {
      if (Array.isArray(res)) {
        setRequirementList(res);
      } else {
        setRequirementList([]);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorAdd) toast.error(errorAdd.message);
    if (errorRemove) toast.error(errorRemove.message);
  }, [errorAdd, errorRemove]);
  const handleAdd = (selected: number) => {
    if (!linkedRequirements?.some((r) => r.id === selected)) {
      setLinkedRequirements((prev) => [
        ...prev,
        {
          id: selected,
          title: requirementList.find((re) => re.id == selected)?.title || "",
        },
      ]);
    }
  };

  const handleRemoveLinked = (id: number) => {
    setLinkedRequirements((prev) =>
      prev ? prev.filter((r) => r.id !== id) : []
    );
  };
  const handleUpdate = async () => {
    // Kiểm tra sự thay đổi của các liên kết
    // Nếu danh sách liên kết linkedRequirements có id phần tử không trùng với originalList thì thực hiện xóa id trong original
    // Và gọi hàm thêm để liên kết

    // Danh sách id yêu cầu ban đầu đã liên kết
    const originalIds = originalList.map((req) => req.id);
    // Danh sách id yêu cầu hiện tại đã chọn liên kết
    const currentIds = linkedRequirements.map((req) => req.id);

    // Các yêu cầu bị xóa (có trong original nhưng không còn trong linkedRequirements)
    const removedIds = originalIds.filter((id) => !currentIds.includes(id));
    // Các yêu cầu mới được thêm (có trong linkedRequirements nhưng không có trong original)
    const addedIds = currentIds.filter((id) => !originalIds.includes(id));

    // Xóa liên kết các yêu cầu bị xóa
    if (removedIds.length > 0) {
      await updateLinkRemove("/tasks/requirement", {
        type: "remove",
        task_id,
        requirement_id: removedIds,
      });
    }

    // Thêm liên kết các yêu cầu mới
    if (addedIds.length > 0) {
      await updateLinkAdd("/tasks/requirement", {
        type: "add",
        task_id,
        requirement_id: addedIds,
      });
    }
    toast.success("Xử lý thành công");
    await onUpdate();
    onClose();
  };

  const visibleRequirementList = requirementList.filter(
    (req) => !linkedRequirements?.some((r) => r.id === req.id)
  );

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl w-full">
        <h3 className="font-bold text-lg">Liên kết yêu cầu</h3>
        <div className="grid grid-cols-2 gap-3 p-3">
          <div className="shadow flex flex-col justify-center items-center">
            <h4 className="p-2">Danh sách yêu cầu</h4>
            <input type="text" placeholder="Lọc" className="input" />
            <div className="max-h-[400px] overflow-y-auto mt-2">
              <ul className="list bg-base-200 rounded-box">
                {visibleRequirementList.map((req) => (
                  <li
                    key={req.id}
                    value={req.id}
                    className="flex justify-between p-2"
                  >
                    <span>{req.title}</span>
                    <button
                      className="btn btn-circle btn-sm"
                      onClick={() => handleAdd(req.id)}
                    >
                      <Plus />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="shadow flex flex-col items-center">
            <h4>Yêu cầu đã chọn liên kết</h4>
            <div className="max-h-[400px] overflow-y-auto mt-2">
              <ul className="list bg-base-200 rounded-box gap-1">
                {linkedRequirements &&
                  linkedRequirements.map((req) => (
                    <li
                      key={req.id}
                      className="flex justify-between items-center bg-base-100 p-2 rounded w-full"
                    >
                      <span>{req.title}</span>
                      {
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleRemoveLinked(req.id)}
                        >
                          <X></X>
                        </button>
                      }
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Xác nhận "
            )}
          </button>
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
//**
// {loadData ? (
//   <span className="loading loading-infinity loading-xl"></span>
// ) : requirementList.length > 0 ? (
//   <fieldset className="fieldset">
//     <legend className="fieldset-legend">Yêu cầu</legend>
//     <div className="flex gap-2 items-center">
//       <select
//         className="select"
//         value={selectedRequirementId}
//         onChange={(e) =>
//           setSelectedRequirementId(Number(e.target.value))
//         }
//       >
//         <option value="">-- Chọn yêu cầu --</option>
//         {requirementList.map((req) => (
//           <option key={req.id} value={req.id}>
//             {req.title}
//           </option>
//         ))}
//       </select>
//       <button className="btn btn-sm" onClick={handleAdd}>
//         Thêm
//       </button>
//     </div>
//   </fieldset>
// ) : (
//   <div className="alert alert-info">
//     <span>Không có yêu cầu nào để liên kết</span>
//   </div>
// )}
// {/* Danh sách các yêu cầu đã có sẵn */}
// {linkedRequirements && linkedRequirements.length > 0 && (
//   <fieldset className="fieldset">
//     <legend className="fieldset-legend">Đã liên kết</legend>
//     <ul className="space-y-1">
//       {linkedRequirements.map((req) => (
//         <li
//           key={req.id}
//           className="flex justify-between items-center bg-base-100 p-2 rounded"
//         >
//           <span>{req.title}</span>
//           {
//             <button
//               className="btn btn-xs btn-error"
//               onClick={() => handleRemoveLinked(req.id)}
//             >
//               Hủy
//             </button>
//           }
//         </li>
//       ))}
//     </ul>
//   </fieldset>
// )}
// {/* Danh sách các yêu cầu đã chọn */}
// {selectedRequirement.length > 0 && (
//   <fieldset className="fieldset">
//     <legend className="fieldset-legend">Đã chọn</legend>
//     <ul className="space-y-1">
//       {selectedRequirement.map((req) => (
//         <li
//           key={req.id}
//           className="flex justify-between items-center bg-base-100 p-2 rounded"
//         >
//           <span>{req.title}</span>
//           {
//             <button
//               className="btn btn-xs btn-error"
//               onClick={() => handleRemove(req.id)}
//             >
//               Hủy
//             </button>
//           }
//         </li>
//       ))}
//     </ul>
//   </fieldset>
// )}
//  */
