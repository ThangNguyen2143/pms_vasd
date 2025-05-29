"use client";
import { memo, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { WorkStatus } from "~/lib/types";
import ErrorMessage from "../ui/error-message";
import clsx from "clsx";
import { status_with_color } from "~/utils/status-with-color";
interface DataPut {
  work_id: number;
  status: string;
}
function EditStatusModal({
  display,
  statusList,
  work_id,
  onUpdated,
}: {
  display: string;
  statusList: WorkStatus[];
  work_id: number;
  onUpdated: () => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { putData, errorData, isErrorDialogOpen, setIsErrorDialogOpen } =
    useApi<"", DataPut>();
  const handleClick = async (dis: string) => {
    // Handle click event for account type selection
    const selectedType = statusList?.find((item) => item.display === dis);
    if (selectedType) {
      setIsUpdating(true);
      const re = await putData("/work/status", {
        work_id: work_id,
        status: selectedType.code,
      }); // Replace with your logic to handle the selected type
      if (re == "") {
        onUpdated(); // Gọi callback để cập nhật lại danh sách
      } else {
        setIsErrorDialogOpen(true);
        return;
      }
      setIsUpdating(false);
    }
  }; // Load account type when component mounts
  return (
    <>
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className={clsx(
            "btn m-1",
            `btn-${status_with_color(
              statusList.find((st) => st.display == display)?.code || ""
            )}`
          )}
        >
          {isUpdating ? "Đang cập nhật..." : display}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {statusList?.map((item) => {
            return item.display !== display ? (
              <li key={item.code}>
                <a onClick={(e) => handleClick(e.currentTarget.innerHTML)}>
                  {item.display}
                </a>
              </li>
            ) : (
              <li key={item.code} className="menu-disabled">
                <a className="menu-active">{item.display}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <ErrorMessage
        errorData={errorData}
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
      />
    </>
  );
}

export default memo(EditStatusModal);
