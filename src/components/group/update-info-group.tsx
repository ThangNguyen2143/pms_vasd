"use client";
import { useState } from "react";
import { toast } from "sonner";
import Dialog from "~/components/ui/dialog";
import { updateData } from "~/lib/api-client";

interface GroupInfor {
  group_id: string;
  group_name: string;
  group_description: string;
}
function UpdateInfoGroup({ group }: { group: GroupInfor }) {
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
    else toast.success(res.message);
  };
  return (
    <Dialog
      nameBtn={<>Sửa thông tin</>}
      typeBtn="outline"
      title="Cập nhật thông tin nhóm"
    >
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
          <textarea
            placeholder="Nhập mô tả nhóm"
            className="textarea textarea-md w-full"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" onClick={handlderClick}>
          Thay đổi
        </button>
      </div>
    </Dialog>
  );
}

export default UpdateInfoGroup;
