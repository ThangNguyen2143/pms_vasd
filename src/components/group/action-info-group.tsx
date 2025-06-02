import { GroupDto } from "~/lib/types";
import AddMemberBtn from "./add-member-btn";
import UpdateInfoGroup from "./update-info-group";
import { useState } from "react";
interface UserInGroup {
  user_code: string;
  display_name: string;
  date_join: string;
}
function ActionInfoGroup({
  group,
  userInGroup,
  onUpdate,
}: {
  group: GroupDto;
  userInGroup?: UserInGroup[];
  onUpdate: () => Promise<void>;
}) {
  const [showAddMemberModal, setshowAddMemberModal] = useState(false);
  const [showUpdateInfoModal, setshowUpdateInfoModal] = useState(false);
  return (
    <div className="flex gap-3">
      <button
        className="btn btn-primary"
        onClick={() => setshowAddMemberModal(true)}
      >
        + Thêm thành viên
      </button>
      <button
        className="btn btn-outline"
        onClick={() => setshowUpdateInfoModal(true)}
      >
        Sửa thông tin
      </button>
      {showAddMemberModal && (
        <AddMemberBtn
          group_id={group.group_id}
          memberGroup={userInGroup || undefined}
          onUpdate={onUpdate}
          onClose={() => setshowAddMemberModal(false)}
        />
      )}
      {showUpdateInfoModal && (
        <UpdateInfoGroup
          group={group}
          onUpdate={onUpdate}
          onClose={() => setshowUpdateInfoModal(false)}
        />
      )}
    </div>
  );
}

export default ActionInfoGroup;
