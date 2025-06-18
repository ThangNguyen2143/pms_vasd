/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { format_date } from "~/utils/fomat-date";
type FunctionModule = {
  id: string;
  title: string;
  description: string;
  date_create: string;
  created_by: number;
  create_name: string;
  tags: string[];
};
function DetailFunctionModule({
  module_id,
  product_id,
  onClose,
}: {
  module_id: string;
  product_id: string;
  onClose: () => void;
}) {
  const { data: funcList, getData: getListFunc } = useApi<FunctionModule[]>();
  const { postData, isLoading: loadingPost, errorData: errorPost } = useApi();
  const { putData, isLoading: loadingPut, errorData: errorPut } = useApi();
  const [updateFunc, setUpdateFunc] = useState<string>();
  const [addModule, setAddModule] = useState(false);
  const [formAdd, setFormAdd] = useState<{
    title: string;
    description: string;
    tags: string[];
  }>({
    title: "",
    description: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");
  const [tagsUpdate, setTagsUpdate] = useState("");
  const [formUpdate, setFormUpdate] = useState({
    func_id: "",
    title: "",
    description: "",
    tags: [""],
  });
  useEffect(() => {
    if (module_id != "")
      getListFunc(
        "/product/" + encodeBase64({ type: "func_module", module_id }),
        "reload"
      );
  }, [module_id]);
  useEffect(() => {
    if (errorPost) toast.error(errorPost.message || errorPost.title);
    if (errorPut) toast.error(errorPut.message || errorPut.title);
  }, [errorPost, errorPut]);
  const handleAddTag = () => {
    if (newTag.trim() && !formAdd.tags.includes(newTag)) {
      setFormAdd((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormAdd((pre) => {
      const updateTags = pre.tags.filter((t) => t !== tag);

      return {
        ...pre,
        tags: updateTags,
      };
    });
  };
  const handleAddUpdateTag = () => {
    if (tagsUpdate.trim() && !formUpdate.tags.includes(tagsUpdate)) {
      setFormUpdate((prev) => ({
        ...prev,
        tags: [...prev.tags, tagsUpdate.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTagUpdate = (tag: string) => {
    setFormUpdate((pre) => {
      const updateTags = pre.tags.filter((t) => t !== tag);

      return {
        ...pre,
        tags: updateTags,
      };
    });
  };
  const handleAddFunc = async () => {
    const payload = {
      product_id,
      module_id,
      title: formAdd.title,
      description: formAdd.description,
      tags: formAdd.tags,
    };
    const re = await postData("/product/module/functions", payload);
    if (re == "") {
      toast.success("Thêm chức năng thành công");
      await getListFunc(
        "/product/" + encodeBase64({ type: "func_module", module_id }),
        "reload"
      );
      setAddModule(false);
    }
  };
  const handleUpdate = async () => {
    const payload = {
      ...formUpdate,
      module_id,
    };
    const re = await putData("/product/module/functions", payload);
    if (re == "") {
      toast.success("Cập nhật thành công");
      await getListFunc(
        "/product/" + encodeBase64({ type: "func_module", module_id }),
        "reload"
      );
      setUpdateFunc(undefined);
      setFormUpdate({
        title: "",
        description: "",
        func_id: "",
        tags: [],
      });
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </div>
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Danh sách các chức năng trong module
        </h3>

        <ul className="list bg-base-100 rounded-box shadow-md pl-2">
          {funcList ? (
            funcList.map((m) => {
              return (
                <li key={m.id}>
                  <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold flex justify-between">
                      {updateFunc != m.id ? (
                        <>
                          <span>{m.title}</span>
                          <div>
                            {m.tags.map((tag, i) => (
                              <span
                                key={i + "tag" + m.id}
                                className="badge badge-info"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <span>Sửa chức năng</span>
                      )}
                    </div>
                    <div className="collapse-content text-sm flex flex-col">
                      {updateFunc != m.id ? (
                        <>
                          <span className="max-h-20 overflow-auto break-words">
                            {m.description}
                          </span>
                          <span>Được thêm bởi: {m.create_name}</span>
                          <span>Vào lúc: {format_date(m.date_create)}</span>
                          <button
                            className="btn btn-info btn-outline"
                            onClick={() => {
                              setUpdateFunc(m.id);
                              setFormUpdate({
                                title: m.title,
                                description: m.description,
                                func_id: m.id,
                                tags: m.tags,
                              });
                            }}
                          >
                            Sửa
                          </button>
                        </>
                      ) : (
                        <>
                          <label className="floating-label">
                            <span className="label">Tên chức năng</span>
                            <input
                              type="text"
                              value={formUpdate.title}
                              className="input w-full"
                              onChange={(e) =>
                                setFormUpdate((pre) => ({
                                  ...pre,
                                  title: e.target.value,
                                }))
                              }
                            />
                          </label>

                          <label className="floating-label mt-4">
                            <span className="label">Mô tả</span>
                            <input
                              type="text"
                              className="input w-full"
                              value={formUpdate.description}
                              onChange={(e) =>
                                setFormUpdate((pre) => ({
                                  ...pre,
                                  description: e.target.value,
                                }))
                              }
                            />
                          </label>

                          <div className="join w-full my-4">
                            <input
                              type="text"
                              className="input join-item w-full"
                              value={tagsUpdate}
                              onChange={(e) => setTagsUpdate(e.target.value)}
                              onKeyUp={(e) => {
                                if (e.key == "Enter") handleAddUpdateTag();
                              }}
                              placeholder="Nhập thẻ và nhấn Thêm"
                            />
                            <button
                              type="button"
                              className="btn join-item btn-outline btn-neutral"
                              onClick={handleAddUpdateTag}
                            >
                              Thêm
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formUpdate.tags.map((tag, idx) => (
                              <div key={idx} className="badge badge-info gap-2">
                                {tag}
                                <button
                                  type="button"
                                  className="text-xs ml-1"
                                  onClick={() => handleRemoveTagUpdate(tag)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <div>
                            <button
                              className="btn btn-info btn-outline"
                              onClick={handleUpdate}
                              disabled={loadingPut}
                            >
                              {loadingPut ? (
                                <span className="loading loading-spinner"></span>
                              ) : (
                                "Ok"
                              )}
                            </button>
                            <button
                              className="btn btn-ghost"
                              onClick={() => {
                                setUpdateFunc(undefined);
                                setFormUpdate({
                                  title: "",
                                  tags: [""],
                                  description: "",
                                  func_id: "",
                                });
                              }}
                            >
                              Hủy
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li>Chưa có chức năng nào</li>
          )}
        </ul>
        {addModule && (
          <div className="mt-4 flex flex-col gap-2">
            <h5 className="text-lg">Thêm Chức năng</h5>
            <label className="input w-full">
              <span className="label">Tên chức năng</span>
              <input
                type="text"
                value={formAdd.title}
                onChange={(e) =>
                  setFormAdd((pre) => ({ ...pre, title: e.target.value }))
                }
              />
            </label>
            <label className="input w-full">
              <span className="label">Mô tả</span>
              <input
                type="text"
                value={formAdd.description}
                onChange={(e) =>
                  setFormAdd((pre) => ({ ...pre, description: e.target.value }))
                }
              />
            </label>
            <div className="join w-full">
              <input
                type="text"
                className="input join-item w-full"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key == "Enter") handleAddTag();
                }}
                placeholder="Nhập thẻ và nhấn Thêm"
              />
              <button
                type="button"
                className="btn join-item btn-outline btn-neutral"
                onClick={handleAddTag}
              >
                Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formAdd.tags.map((tag, idx) => (
                <div key={idx} className="badge badge-info gap-2">
                  {tag}
                  <button
                    type="button"
                    className="text-xs ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div>
              <button
                className="btn btn-primary"
                onClick={handleAddFunc}
                disabled={loadingPost}
              >
                {loadingPost ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Thêm"
                )}
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
            Thêm chức năng
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailFunctionModule;
