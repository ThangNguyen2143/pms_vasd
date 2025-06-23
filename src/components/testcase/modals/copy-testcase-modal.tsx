"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductModule } from "~/lib/types";

function CopyTestcaseModal({
  test_id,
  onClose,
}: {
  test_id: number;
  onClose: () => void;
}) {
  const [productSelect, setProductSelect] = useState("");
  const [moduleSelect, setModuleSelect] = useState("");
  const { data: productLists, getData: getProducts } =
    useApi<{ id: string; name: string }[]>();
  const { data: moduleLists, getData: getModules } = useApi<ProductModule[]>();
  const {
    postData: copyTest,
    isLoading: loadingCopy,
    errorData: errorCopy,
  } = useApi();
  useEffect(() => {
    getProducts("/system/config/" + encodeBase64({ type: "product" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (productSelect != "")
      getModules(
        "/product/" +
          encodeBase64({ type: "module", product_id: productSelect })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSelect]);
  useEffect(() => {
    if (errorCopy) toast.error(errorCopy.message || errorCopy.title);
  }, [errorCopy]);
  const handleCopyTest = async () => {
    const re = await copyTest("/testcase/copy", {
      test_id,
      product_id: productSelect,
      module: moduleSelect,
    });
    if (re != "") return;
    toast.success("Sao chép test thành công!");
    onClose();
  };
  return (
    <div className="modal modal-open">
      <div className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </div>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Sao chép testcase tới phần mềm</h3>
        <div className="flex flex-col mt-4 gap-2">
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
          {moduleLists && (
            <select
              value={moduleSelect}
              className="select w-full"
              onChange={(e) => setModuleSelect(e.target.value)}
            >
              <option value="" disabled>
                Chọn module
              </option>
              {moduleLists.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.display}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={handleCopyTest}
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

export default CopyTestcaseModal;
