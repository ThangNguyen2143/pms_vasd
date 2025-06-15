"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { CreateProductSchema, CreateProductState } from "~/lib/definitions";
type NewModule = {
  id?: string;
  code: string;
  display: string;
};
interface CreateProductData {
  project_id: number;
  name: string;
  description: string;
  productModules: Exclude<NewModule, "id">[];
}
function AddProductBtn({
  project_id,
  onUpdate,
}: {
  project_id: number;
  onUpdate: () => Promise<void>;
}) {
  const [state, setState] = useState<CreateProductState>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modules, setModules] = useState<NewModule[]>([]);
  const {
    postData,
    errorData: errorPost,
    isLoading,
  } = useApi<string, CreateProductData>();
  useEffect(() => {
    if (errorPost) toast.error(errorPost.message || errorPost.title);
  }, [errorPost]);
  const handleCreateProduct = async () => {
    const validatedFields = CreateProductSchema.safeParse({
      project_id: project_id,
      name,
      description,
      productModules: modules,
    });
    if (!validatedFields.success) {
      setState({
        errors: validatedFields.error.flatten().fieldErrors,
      });
      return;
    }
    const data = await postData("/product", validatedFields.data);
    if (data == "") {
      document.getElementById("AddGroupDialog")?.click();
      await onUpdate();
      toast.success("Tạo thành công");
    }
  };
  const handleAddModule = () => {
    setModules((pre) => [
      ...pre,
      { id: crypto.randomUUID(), code: "", display: "" },
    ]);
  };
  const handleRemoveModule = (id?: string) => {
    setModules((pre) => pre.filter((mo) => mo.id != id));
  };
  const handleModuleChange = ({
    id,
    field,
    value,
  }: {
    id?: string;
    field: keyof NewModule;
    value: string;
  }) => {
    if (!id) return;
    const updateModule = modules.find((m) => m.id == id);
    if (!updateModule) return;
    updateModule[field] = value;
    setModules((pre) =>
      pre.map((p) => {
        if (p.id == updateModule.id) return updateModule;
        else return p;
      })
    );
  };
  if (project_id === 0) {
    return (
      <label htmlFor="AddGroupDialog" className="btn btn-info disabled">
        Thêm phần mềm
      </label>
    );
  }
  return (
    <>
      <label htmlFor="AddGroupDialog" className="btn btn-info">
        Thêm phần mềm
      </label>
      <input type="checkbox" id="AddGroupDialog" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box justify-items-center">
          <h3 className="text-xl font-bold p-4">Thêm phần mềm mới</h3>
          <div>
            <div className="flex flex-col gap-4 justify-center">
              <label className="input w-full">
                <span className="label">Tên phần mềm</span>
                <input
                  type="text"
                  placeholder="Nhập tên phần mềm"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  min={1}
                />
              </label>
              {state?.errors?.name && (
                <div className="validator-hint text-error">
                  {state.errors.name}
                </div>
              )}
              <label className="input w-full">
                <span className="label">Mô tả</span>
                <input
                  type="text"
                  placeholder="Nhập mô tả phần mềm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  className="validator"
                  minLength={2}
                />
              </label>
              {state?.errors?.description && (
                <div className="validator-hint text-error">
                  {state.errors.description}
                </div>
              )}
              {modules.length > 0 &&
                modules.map((module, index) => {
                  return (
                    <div key={index} className="join">
                      <input
                        type="text"
                        value={module.code}
                        placeholder="Mã module"
                        className="join-item input"
                        onChange={(e) =>
                          handleModuleChange({
                            id: module.id,
                            field: "code",
                            value: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        value={module.display}
                        placeholder="Tên module"
                        className="join-item input"
                        onChange={(e) =>
                          handleModuleChange({
                            id: module.id,
                            field: "display",
                            value: e.target.value,
                          })
                        }
                      />
                      <button
                        className="btn btn-outline btn-error join-item"
                        onClick={() => handleRemoveModule(module.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
              <div className="flex gap-2">
                {/* <button className="btn btn-dash">Sao chép module</button> */}
                <button className="btn btn-primary" onClick={handleAddModule}>
                  Thêm module
                </button>
              </div>
              <div className="flex justify-between items-center gap-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  onClick={handleCreateProduct}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Thêm"
                  )}
                </button>
                <label htmlFor="AddGroupDialog" className="btn btn-error ml-4">
                  Hủy
                </label>
              </div>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="AddGroupDialog">
          Close
        </label>
      </div>
    </>
  );
}

export default AddProductBtn;
