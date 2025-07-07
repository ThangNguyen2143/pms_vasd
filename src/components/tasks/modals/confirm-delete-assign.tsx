import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";

function ConfirmDeleteAssign({
  task_id,
  member,
  onClose,
  onUpdate,
}: {
  task_id: number;
  member: number;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const { removeData, errorData, isLoading } = useApi<"">();
  const handlerRemove = async () => {
    await removeData(
      "/tasks/assign/" + encodeBase64({ task_id, user_id: member })
    );
    if (errorData) toast.error(errorData.message || errorData.title);
    else {
      await onUpdate();
      toast.success("Đã xóa thành viên khỏi công việc");
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Xóa thành viên?</h3>
        <p className="py-4">Xác nhận xóa</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-error" onClick={handlerRemove}>
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteAssign;
