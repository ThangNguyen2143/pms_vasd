import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProjectMemberDto } from "~/lib/types";

function ConfirmDeleteMember({
  project_id,
  member,
  onClose,
  onUpdate,
}: {
  project_id: number;
  member: ProjectMemberDto;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const { removeData, errorData, isLoading } = useApi<"">();
  const handlerRemove = async () => {
    await removeData(
      "/project/member/" + encodeBase64({ project_id, user_id: member.id })
    );
    if (errorData) toast.error(errorData.message);
    else {
      await onUpdate();
      toast.success("Đã xóa thành viên");
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Xóa thành viên?</h3>
        <p className="py-4">
          Xác nhận xóa: <b>{member.name}</b>
        </p>
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

export default ConfirmDeleteMember;
