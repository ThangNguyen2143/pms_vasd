"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductDto } from "~/lib/types";

function UpdateInfoProductModal({
  product,
  onClose,
  onUpdate,
}: {
  product: ProductDto;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}) {
  const { putData, isLoading, errorData, removeData } = useApi<
    string,
    { id: string; name: string; description: string }
  >();
  const [name, setName] = useState<string>(product.name);
  const [description, setDescription] = useState<string>(product.description);
  useEffect(() => {
    if (errorData) {
      toast.error("Lỗi: " + errorData.message);
    }
  }, [errorData]);
  const handleUpdate = async () => {
    const product_id = product.id;
    if (!product_id) {
      toast.error("Không tìm thấy ID phần mềm");
      return;
    }

    const updateEndpoint = "/product";
    const updateBody = {
      id: product_id,
      name,
      description,
    };
    try {
      const re = await putData(updateEndpoint, updateBody);
      if (re != "") return;
      toast.success("Cập nhật thành công");
      onUpdate();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Cập nhật thất bại: " + error.message);
    }
  };
  const handleRemove = async () => {
    const deleteEndpoint = `/product/${encodeBase64({ id: product.id })}`;
    try {
      const re = await removeData(deleteEndpoint);
      if (re != "") return;
      toast.success("Xóa sản phẩm thành công");
      onUpdate();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Xóa sản phẩm thất bại: " + error.message);
    }
  };
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => onClose()}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Chỉnh sửa sản phẩm</h3>

        <form className="flex flex-col gap-3 mt-4 items-center">
          <label className="input">
            <span className="label">Tên sản phẩm</span>
            <input
              id="name"
              name="name"
              type="text"
              className=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="input">
            <span className="label">Mô tả</span>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className="modal-action flex justify-between w-full">
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {" "}
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                " Cập nhật"
              )}
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={handleRemove}
            >
              Xóa sản phẩm
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default UpdateInfoProductModal;
