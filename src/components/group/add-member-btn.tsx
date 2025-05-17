"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import Dialog from "~/components/ui/dialog";
import { updateData } from "~/lib/api-client";
import { UserDto } from "~/lib/types";
interface MemberGroup {
  user_code: string;
  display_name: string;
  date_join: string;
}
function AddMemberBtn({
  listEmployee,
  memberGroup,
  group_id,
}: {
  listEmployee: UserDto[];
  memberGroup: MemberGroup[];
  group_id: string;
}) {
  const meber: MemberGroup[] = memberGroup || [];
  const [member, setMember] = useState<MemberGroup[]>(meber);
  const handleAdd = async (user_code: string) => {
    const data = {
      type: "add",
      user_code,
      group_id,
    };
    const res = await updateData<
      "",
      { group_id: string; user_code: string; type: string }
    >({ endpoint: "/group/user", data });
    if (res.code != 200) window.alert("Lỗi " + res.code + " " + res.message);
    else {
      window.alert("Đã xử lý thành công!");
      setMember([
        ...member,
        { user_code, display_name: "", date_join: Date.now().toString() },
      ]);
    }
  };
  return (
    <Dialog
      nameBtn={<>Thêm thành viên</>}
      title="Chọn thành viên"
      typeBtn="primary"
    >
      <label className="input">
        <span className="label">Tìm kiếm</span>
        <input type="text" placeholder="Nhập tên" />
      </label>
      <ul className="list rounded-box shadow-md">
        {listEmployee
          .filter((us) => {
            return (
              member.find((mem) => mem.user_code == us.accountData.code) ==
              undefined
            );
          })
          .map((user) => {
            return (
              <li key={user.userid} className="flex justify-between p-2">
                <div>{user.userData.display_name}</div>
                <button
                  onClick={(e) => handleAdd(e.currentTarget.value)}
                  value={user.accountData.code}
                >
                  <Plus />
                </button>
              </li>
            );
          })}
      </ul>
    </Dialog>
  );
}

export default AddMemberBtn;
