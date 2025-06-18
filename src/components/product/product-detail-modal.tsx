"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { ProductModule } from "~/lib/types";

function ProductModuleModal({
  product_id,
  onClose,
  onOpenFunc,
}: {
  product_id: string;
  onOpenFunc: (id: string) => void;
  onClose: () => void;
}) {
  const { data, getData } = useApi<ProductModule[]>();
  const { postData, errorData } = useApi();
  const { putData, errorData: errorPut } = useApi();
  const [updateModule, setUpdateModule] = useState<string>();
  const [addModule, setAddModule] = useState(false);
  const [formAdd, setFormAdd] = useState({ code: "", display: "" });
  const [formUpdate, setFormUpdate] = useState({
    code: "",
    display: "",
    module_id: "",
  });
  const reloadData = async () => {
    getData(
      "/product/" + encodeBase64({ type: "module", product_id }),
      "reload"
    );
  };
  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product_id]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
    if (errorPut) toast.error(errorPut.message);
  }, [errorData, errorPut]);
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
      setAddModule(false);
      await reloadData();
    }
  };
  const handleUpdate = async () => {
    if (
      !product_id ||
      formUpdate.code.trim().length == 0 ||
      formUpdate.display.trim().length == 0
    ) {
      toast.info("Vui lòng nhập đầy đủ các trường");
      return;
    }
    const dataSend = {
      product_id,
      ...formUpdate,
    };
    const re = await putData("/product/module", dataSend);
    if (re == "") {
      toast.success("Cập nhật thành công");
      setUpdateModule(undefined);
      setFormUpdate({ module_id: "", code: "", display: "" });
      await reloadData();
    }
  };
  return (
    <div className="bg-base-200 text-base-content h-full max-w-1/2 w-md">
      <div className="p-5">
        <h3>Chi tiết module phần mềm</h3>
        <ul className="list bg-base-100 rounded-box shadow-md pl-2">
          {data ? (
            data.map((m) => {
              if (updateModule != m.code)
                return (
                  <li key={m.id} className="list-row">
                    <div className="text-center items-center flex">
                      {m.code}
                    </div>
                    <div className="text-center items-center flex">
                      {m.display}
                    </div>
                    <button
                      className="btn btn-info btn-outline"
                      onClick={() => {
                        setUpdateModule(m.code);
                        setFormUpdate({
                          code: m.code,
                          display: m.display,
                          module_id: m.id,
                        });
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenFunc(m.id)}
                    >
                      Chức năng
                    </button>
                  </li>
                );
              else
                return (
                  <li key={m.id} className="list-row">
                    <div className="text-center items-center flex">
                      <label className="floating-label">
                        <span className="label">Mã modlue</span>
                        <input
                          type="text"
                          value={formUpdate.code}
                          onChange={(e) =>
                            setFormUpdate((pre) => ({
                              ...pre,
                              code: e.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                    <div className="text-center items-center flex">
                      <label className="floating-label">
                        <span className="label">Tên hiển thị</span>
                        <input
                          type="text"
                          value={formUpdate.display}
                          onChange={(e) =>
                            setFormUpdate((pre) => ({
                              ...pre,
                              display: e.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                    <button
                      className="btn btn-info btn-outline"
                      onClick={handleUpdate}
                    >
                      Ok
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        setUpdateModule(undefined);
                        setFormUpdate({ code: "", display: "", module_id: "" });
                      }}
                    >
                      Hủy
                    </button>
                  </li>
                );
            })
          ) : (
            <li>Chưa có module nào</li>
          )}
        </ul>
      </div>

      {addModule && (
        <div className="mt-4 flex flex-col gap-2">
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
          <div>
            <button className="btn btn-primary" onClick={handleAddModule}>
              Thêm
            </button>
            <button
              className="btn btn-accent"
              onClick={() => setAddModule(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
      <div className="modal-action">
        <button
          className="btn btn-primary"
          onClick={() => setAddModule(true)}
          hidden={addModule}
        >
          Thêm module
        </button>
        <button className="btn btn-ghost" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}

export default ProductModuleModal;
