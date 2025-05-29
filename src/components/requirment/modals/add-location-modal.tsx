import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

function AddLocationModal({
  project_id,
  onClose,
  onUpdate,
}: {
  project_id: number;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const [newLocationName, setNewLocationName] = useState("");
  const { postData, errorData, isLoading } = useApi<
    "",
    { project_id: number; location_name: string }
  >();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleAddLocation = async () => {
    const data = {
      project_id,
      location_name: newLocationName,
    };
    const re = await postData("/project/location", data);
    if (re != "") return;
    else {
      toast.success("Xử lý thành công");
      await onUpdate();
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Thêm khoa/phòng mới</h3>
        <input
          type="text"
          className="input input-bordered w-full mt-4"
          placeholder="Tên khoa/phòng"
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLocationModal;
