"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";

function AddModuleProductModal({
  product_id,
  reloadData,
  onClose,
}: {
  product_id: string;
  reloadData: () => Promise<void>;
  onClose: () => void;
}) {
  const [formAdd, setFormAdd] = useState({ code: "", display: "" });
  const { postData, errorData: errorPost } = useApi<string>();
  useEffect(() => {
    if (errorPost) {
      console.error(errorPost);
      toast.error(errorPost.message || errorPost.title);
    }
  }, [errorPost]);
  const handleAddModule = async () => {
    if (
      product_id == "" ||
      formAdd.code.trim().length == 0 ||
      formAdd.display.trim().length == 0
    ) {
      toast.info("Vui lòng nhập đầy đủ các trường");
      return;
    }
    const dataSend = {
      product_id,
      code: formAdd.code,
      display: formAdd.display,
    };
    const re = await postData("/product/module", dataSend);
    if (re == "") {
      toast.success("Thêm module thành công");
      setFormAdd({ code: "", display: "" });
      await reloadData();
      onClose();
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="mt-4 flex flex-col gap-2 justify-center items-center">
          <h5 className="text-lg">Thêm module</h5>
          <label className="input">
            <span className="label">Mã module</span>
            <input
              type="text"
              value={formAdd.code}
              onChange={(e) =>
                setFormAdd((pre) => ({ ...pre, code: e.target.value }))
              }
            />
          </label>
          <label className="input">
            <span className="label">Tên module</span>
            <input
              type="text"
              value={formAdd.display}
              onChange={(e) =>
                setFormAdd((pre) => ({ ...pre, display: e.target.value }))
              }
            />
          </label>
          <div className="flex justify-between w-full px-7">
            <button className="btn btn-primary" onClick={handleAddModule}>
              Thêm
            </button>
            <button className="btn btn-accent" onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddModuleProductModal;
