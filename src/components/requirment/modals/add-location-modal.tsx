import { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

function AddLocationModal({
  project_id,
  onClose,
}: {
  project_id: number;
  onClose: () => void;
}) {
  const [newLocationName, setNewLocationName] = useState("");
  const { postData, errorData, isLoading } = useApi<
    "",
    { project_id: number; location_name: string }
  >();
  const handleAddLocation = async () => {
    const data = {
      project_id,
      location_name: newLocationName,
    };
    await postData("/project/location", data);
    if (errorData) toast.error(errorData.message);
    else {
      toast.success("Xử lý thành công");
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
