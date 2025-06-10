/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import { useApi } from "~/hooks/use-api";
import { ProductDto, RequirementType } from "~/lib/types";

interface AddRequirementProps {
  product_list: ProductDto[];
  locationList: { id: number; name: string }[];
  onAddNewLocation: () => void;
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
  request: {
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
  const [description, setDescription] = useState("");
  const [typeSelected, setTypeSelected] = useState("");
  const [dateReceive, setDateReceive] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [locationId, setLocationId] = useState<number | "">("");
  const [requester, setRequester] = useState("");
  const [role, setRole] = useState("");

  const { postData, isLoading, errorData } = useApi<"", DataCreate>();
  const {
    data: typeList,
    getData,
    errorData: errorListType,
  } = useApi<RequirementType[]>();
  useEffect(() => {
    getData(
      "/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfdHlwZSJ9",
      "force-cache"
    );
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
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
      date_receive: dateReceive,
      tags,
      request: {
        requester,
        location_id: Number(locationId),
        role,
      },
    };

    const re = await postData("/requirements", data);
    if (re != "") return;
    else {
      toast.success("Tạo yêu cầu thành công");
      await onCreated();
      onClose();
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-7xl max-h-11/12 h-full">
        <h3 className="font-bold text-lg mb-2">Tạo yêu cầu mới</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 text-lg">
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
          <label className="floating-label sm:col-span-2">
            <span>Mô tả</span>
            <RichTextEditor
              placeholder="Mô tả"
              value={description}
              onChange={setDescription}
            />
          </label>

          <label className="floating-label">
            <span>Ngày ghi nhận</span>
            <input
              type="datetime-local"
              className="input input-neutral w-full"
              placeholder="Ngày ghi nhận"
              value={dateReceive}
              onChange={(e) => setDateReceive(e.target.value)}
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
              <button
                type="button"
                className="btn btn-outline join-item"
                onClick={onAddNewLocation}
              >
                + Thêm
              </button>
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
