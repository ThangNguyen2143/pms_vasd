/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DateTimePicker from "~/components/ui/date-time-picker";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { useUploadFile } from "~/hooks/use-upload-file";
import { ProductDto, RequirementType } from "~/lib/types";
import { format_date, toISOString } from "~/utils/fomat-date";

interface AddRequirementProps {
  product_list: ProductDto[];
  locationList: { id: number; name: string }[];
  onAddNewLocation?: () => void;
  onClose: () => void;
  onCreated: () => Promise<void>;
}

interface DataCreate {
  product_id: string;
  title: string;
  description: string;
  type: string;
  date_receive: string;
  tags: string[];
  request?: {
    location_id: number;
    requester: string;
    role: string;
  };
}

export default function AddRequirementModal({
  product_list,
  locationList,
  onAddNewLocation,
  onClose,
  onCreated,
}: AddRequirementProps) {
  const [productSelect, setproductSelect] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("<p><br/></p>");
  const [typeSelected, setTypeSelected] = useState("");
  const [dateReceive, setDateReceive] = useState(format_date(new Date()));
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [files, setFile] = useState<File[]>([]);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    { name: string; status: "idle" | "uploading" | "done" | "error" }[]
  >([]);
  const { uploadError, uploadChunkedFile } = useUploadFile("put");

  const [locationId, setLocationId] = useState<number | "">("");
  const [requester, setRequester] = useState("");
  const [role, setRole] = useState("");

  const { postData, isLoading, errorData } = useApi<
    { id: number },
    DataCreate
  >();
  const {
    data: typeList,
    getData,
    errorData: errorListType,
  } = useApi<RequirementType[]>();
  useEffect(() => {
    getData("/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfdHlwZSJ9");
  }, []);
  useEffect(() => {
    if (fileUploadStatus.some((st) => st.status == "done")) {
      onCreated();
      onClose();
    }
  }, [fileUploadStatus]);
  useEffect(() => {
    if (errorData) {
      console.log("data send:", {
        product_id: productSelect,
        title,
        description,
        type: typeSelected,
        date_receive: dateReceive,
        tags,
        request: {
          requester,
          location_id: Number(locationId),
          role,
        },
      });
      toast.error(errorData.message || errorData.title);
    }
    if (uploadError) {
      toast.error(uploadError);
    }
  }, [uploadError, errorData]);
  if (!typeList) {
    if (errorListType) toast.error(errorListType.message);
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </div>
    );
  }
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (
      !productSelect ||
      !title ||
      !description ||
      !typeSelected ||
      !dateReceive ||
      !requester ||
      !locationId ||
      !role
    ) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const data: DataCreate = {
      product_id: productSelect,
      title,
      description,
      type: typeSelected,
      date_receive: toISOString(dateReceive),
      tags,
      request: {
        requester,
        location_id: Number(locationId),
        role,
      },
    };
    if (data.request && data.request.location_id == 0) delete data.request;
    const re = await postData("/requirements", data);
    // if (re != "") return;
    // const re = await uploadMultiFiles({
    //   files,
    //   uploadUrl: "/requirements",
    //   meta: {
    //     ...data,
    //   },
    // });

    if (re == null) {
      return;
    }
    if (files.length > 0) {
      await Promise.all(
        files.map(async (file, index) => {
          // Cập nhật trạng thái đang upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = "uploading";
            return next;
          });

          const res = await uploadChunkedFile(file, "/bugs/file", {
            bug_id: re.id,
          });

          // Cập nhật trạng thái sau khi upload
          setFileUploadStatus((prev) => {
            const next = [...prev];
            next[index].status = res && res.code == 200 ? "done" : "error";
            return next;
          });
        })
      );
    } else {
      await onCreated();
      onClose();
    }
    toast.success("Tạo yêu cầu thành công");
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-7xl max-h-11/12 h-full">
        <h3 className="font-bold text-lg mb-2">Tạo yêu cầu mới</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4">
          <label className="floating-label">
            <span>Phần mềm</span>
            <select
              name="product_id"
              value={productSelect}
              className="select w-full"
              onChange={(e) => setproductSelect(e.target.value)}
            >
              <option value="">Chọn phần mềm</option>
              {product_list.map((pd) => (
                <option value={pd.id} key={"productOnCreate" + pd.id}>
                  {pd.name}
                </option>
              ))}
            </select>
          </label>
          <label className="floating-label">
            <span>Loại yêu cầu</span>
            <select
              className="select select-neutral w-full"
              value={typeSelected}
              onChange={(e) => setTypeSelected(e.target.value)}
            >
              <option value="" disabled>
                Chọn loại yêu cầu
              </option>
              {typeList.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.display}
                </option>
              ))}
            </select>
          </label>
          <label className="floating-label sm:col-span-2">
            <span>Tiêu đề</span>
            <input
              type="text"
              className="input input-neutral w-full"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <fieldset className="fieldset sm:col-span-2">
            <legend className="fieldset-legend">Mô tả</legend>
            <RichTextEditor
              placeholder="Mô tả"
              value={description}
              onChange={setDescription}
            />
          </fieldset>

          <label className="floating-label">
            <span>Ngày ghi nhận</span>
            <DateTimePicker
              value={dateReceive}
              onChange={setDateReceive}
              placeholder="Ngày ghi nhận"
              className="input-neutral w-full"
            />
          </label>
          <div>
            <div className="join w-full">
              <input
                type="text"
                className="input join-item input-neutral w-full"
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
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
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
          </div>

          <label className="flex flex-col w-full sm:col-span-2">
            <span className="label">Khoa/Phòng</span>
            <div className="join">
              <select
                className="select select-neutral flex-1 join-item"
                value={locationId}
                onChange={(e) => setLocationId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Chọn khoa/phòng
                </option>
                {locationList.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              {onAddNewLocation && (
                <button
                  type="button"
                  className="btn btn-outline join-item"
                  onClick={onAddNewLocation}
                >
                  + Thêm
                </button>
              )}
            </div>
          </label>

          <label className="floating-label">
            <span>Người yêu cầu</span>
            <input
              type="text"
              value={requester}
              placeholder="Người yêu cầu"
              className="input input-neutral w-full"
              onChange={(e) => setRequester(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span>Vai trò</span>
            <input
              type="text"
              className="input input-neutral w-full"
              placeholder="Vai trò"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Tệp đính kèm</legend>
            <input
              type="file"
              className="file-input file-input-primary mt-4"
              name="fileSend"
              multiple
              placeholder="Chọn tệp đính kèm"
              onChange={(e) => {
                const selected = e.target.files;
                if (selected) {
                  const newFiles = Array.from(selected);

                  // Thêm file mới vào danh sách cũ (tránh trùng tên)
                  setFile((prev) => {
                    const existingNames = new Set(prev.map((f) => f.name));
                    const uniqueNewFiles = newFiles.filter(
                      (f) => !existingNames.has(f.name)
                    );
                    return [...prev, ...uniqueNewFiles];
                  });

                  // Thêm trạng thái upload tương ứng
                  setFileUploadStatus((prev) => {
                    const existingNames = new Set(prev.map((f) => f.name));
                    const newStatus = newFiles
                      .filter((f) => !existingNames.has(f.name))
                      .map((f) => ({
                        name: f.name,
                        status: "idle" as const,
                      }));
                    return [...prev, ...newStatus];
                  });

                  // Reset input để cho phép chọn lại cùng file (bypass browser caching)
                  e.target.value = "";
                }
              }}
            />
          </fieldset>
          {fileUploadStatus.length > 0 && (
            <ul className="mt-2 space-y-1">
              {fileUploadStatus.map((file, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span>{file.name}</span>
                  {file.status === "uploading" && (
                    <span className="loading loading-spinner loading-xs text-info" />
                  )}
                  {file.status === "done" && (
                    <span className="text-success">✓ Đã tải lên</span>
                  )}
                  {file.status === "error" && (
                    <span className="text-error">✕ Lỗi</span>
                  )}
                  <button
                    onClick={() => {
                      setFile((prev) => prev.filter((_, i) => i !== idx));
                      setFileUploadStatus((prev) =>
                        prev.filter((_, i) => i !== idx)
                      );
                    }}
                    className="btn btn-xs btn-error"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
