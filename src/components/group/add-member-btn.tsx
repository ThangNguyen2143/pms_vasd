"use client";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { updateData } from "~/lib/api-client";
import { encodeBase64 } from "~/lib/services";
import { UserDto } from "~/lib/types";
interface MemberGroup {
  user_code: string;
  display_name: string;
  date_join: string;
}
function AddMemberBtn({
  memberGroup,
  group_id,
  onUpdate,
  onClose,
}: {
  memberGroup?: MemberGroup[];
  group_id: string;
  onUpdate: () => Promise<void>;
  onClose: () => void;
}) {
  const meber: MemberGroup[] = memberGroup || [];
  const { data: listEmployee, getData } = useApi<UserDto[]>();
  useEffect(() => {
    getData("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    if (res.code != 200) toast.error("Lỗi " + res.code + " " + res.message);
    else {
      toast.success("Đã xử lý thành công!");
      onUpdate();
      setMember([
        ...member,
        { user_code, display_name: "", date_join: Date.now().toString() },
      ]);
    }
  };
  return (
    <div className="modal modal-open">
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
      <div className="modal-box">
        <h3 className="text-xl">Thêm thành viên</h3>
        <label className="input">
          <span className="label">Tìm kiếm</span>
          <input type="text" placeholder="Nhập tên" />
        </label>
        <ul className="list rounded-box shadow-md">
          {listEmployee &&
            listEmployee
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
      </div>
    </div>
  );
}

export default AddMemberBtn;
