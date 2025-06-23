"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";

function CopyBugModal({
  bug_id,
  onClose,
}: {
  bug_id: number;
  onClose: () => void;
}) {
  const [productSelect, setProductSelect] = useState("");
  const { data: productLists, getData: getProducts } =
    useApi<{ id: string; name: string }[]>();
  const {
    postData: copyBug,
    isLoading: loadingCopy,
    errorData: errorCopy,
  } = useApi();
  useEffect(() => {
    getProducts("/system/config/" + encodeBase64({ type: "product" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorCopy) toast.error(errorCopy.message || errorCopy.title);
  }, [errorCopy]);
  const handleCopyBug = async () => {
    const re = await copyBug("/bugs/copy", {
      bug_id,
      product_id: productSelect,
    });
    if (re != "") return;
    toast.success("Sao chép bug thành công!");
    onClose();
  };
  return (
    <div className="modal modal-open">
      <div className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </div>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Sao chép bug tới phần mềm</h3>
        <div className="flex flex-col mt-4">
          <select
            value={productSelect}
            className="select w-full"
            onChange={(e) => setProductSelect(e.target.value)}
          >
            <option value="" disabled>
              Chọn phần mềm
            </option>
            {productLists ? (
              productLists.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))
            ) : (
              <option>Lỗi tải phần mềm</option>
            )}
          </select>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={handleCopyBug}
            disabled={loadingCopy}
          >
            {loadingCopy ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Xác nhận"
            )}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default CopyBugModal;
