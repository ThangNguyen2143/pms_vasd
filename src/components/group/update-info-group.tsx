"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateData } from "~/lib/api-client";
import RichTextEditor from "../ui/rich-text-editor";

interface GroupInfor {
  group_id: string;
  group_name: string;
  group_description: string;
}
function UpdateInfoGroup({
  group,
  onUpdate,
  onClose,
}: {
  group: GroupInfor;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState<string>(group.group_name);
  const [description, setDescription] = useState<string>(
    group.group_description
  );
  const handlderClick = async () => {
    const data = {
      group_id: group.group_id,
      group_name: name,
      group_description: description,
    };
    const endpoint = "/group";
    const res = await updateData({ endpoint, data });
    if (res.code != 200) toast.error("Lỗi " + res.code + " " + res.message);
    else {
      await onUpdate();
      toast.success(res.message);
    }
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex flex-col gap-2.5">
          <label className="floating-label">
            <span>Tên nhóm</span>
            <input
              type="text"
              placeholder="Nhập tên nhóm"
              className="input input-md w-full"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="floating-label">
            <span>Mô tả</span>
            <RichTextEditor value={description} onChange={setDescription} />
          </label>
          <button className="btn btn-primary" onClick={handlderClick}>
            Thay đổi
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}

export default UpdateInfoGroup;
