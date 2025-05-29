"use client";
import clsx from "clsx";
import { CheckCheck, Pause, Play, SquareX } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
interface StatusPhaseProps {
  phase_id: number;
  status: string;
  onUpdate: () => Promise<void>;
}

function UpdateStatusPhaseComponent({
  phase_id,
  status,
  onUpdate,
}: StatusPhaseProps) {
  const { putData, isLoading, errorData } = useApi<
    "",
    { phase_id: number; status: string }
  >();

  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerUpdateStatus = async (status: string) => {
    const dataSend = {
      phase_id,
      status,
    };
    const re = await putData("/project/phase/status", dataSend);
    if (re != "") return;
    else {
      toast.success("Cập nhật trạng thái thành công");
      await onUpdate();
    }
  };

  return (
    <div className="join">
      <button
        className={clsx("join-item btn btn-primary tooltip btn-sm")}
        data-tip="Bắt đầu giai đoạn"
        onClick={() => handlerUpdateStatus("START")}
        disabled={isLoading || (status != "PLANNED" && status != "ONHOLD")}
      >
        <Play></Play>
      </button>
      <button
        className="join-item btn btn-warning tooltip btn-sm"
        data-tip="Tạm dừng giai đoạn"
        onClick={() => handlerUpdateStatus("PAUSE")}
        disabled={isLoading || status != "INPROGRESS"}
      >
        <Pause></Pause>
      </button>
      <button
        className="join-item btn btn-success tooltip btn-sm"
        data-tip="Hoàn thành giai đoạn"
        onClick={() => handlerUpdateStatus("DONE")}
        disabled={
          isLoading ||
          status == "CANCELLED" ||
          status == "COMPLETED" ||
          status == "PLANNED"
        }
      >
        <CheckCheck />
      </button>
      <button
        className="join-item btn btn-error tooltip btn-sm"
        data-tip="Hủy giai đoạn"
        onClick={() => handlerUpdateStatus("CANCEL")}
        disabled={isLoading || status == "CANCELLED"}
      >
        <SquareX />
      </button>
    </div>
  );
}

export default UpdateStatusPhaseComponent;
