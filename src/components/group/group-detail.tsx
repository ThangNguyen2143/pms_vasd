"use client";
import { GroupDto, RoleType } from "~/lib/types";
import ListofRole from "../employees/list-role";
import ActionInfoGroup from "./action-info-group";
import MemberGroup from "./member-group";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { useEffect } from "react";
import { toast } from "sonner";
interface UserInGroup {
  user_code: string;
  display_name: string;
  date_join: string;
}
function GroupDetail({ group, roles }: { group: GroupDto; roles: RoleType[] }) {
  const {
    data: userGroup,
    getData,
    isLoading: isLoadUser,
    errorData: errorUserGroup,
  } = useApi<UserInGroup[]>();
  useEffect(() => {
    getData(
      "/group/" +
        encodeBase64({
          type: "group",
          kind: "user",
          group_id: group.group_id,
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.group_id]);
  useEffect(() => {
    if (errorUserGroup && errorUserGroup.code != 404)
      toast.error(errorUserGroup.message);
  }, [errorUserGroup]);
  const reloadData = async () => {
    await getData(
      "/group/" +
        encodeBase64({
          type: "group",
          kind: "user",
          group_id: group.group_id,
        })
    );
  };
  const fieldTable = [
    {
      code: "display_name",
      display: "Họ tên",
    },
    {
      code: "date_join",
      display: "Ngày tham gia",
    },
    {
      code: "user_code",
      display: "Hành động",
    },
  ];
  return (
    <div className="bg-base-200 text-base-content h-full max-w-1/2 w-md">
      <div className="p-4 m-2 min-w-96 max-w-5xl flex items-center flex-col">
        <h1 className="p-4 text-2xl">{group.group_name}</h1>
        <p className="p-4 text-xl">Mô tả: {group.group_description}</p>
        <ActionInfoGroup group={group} onUpdate={reloadData} />
      </div>
      <div className="min-w-96 max-w-5xl flex items-center justify-center">
        <div className="tabs tabs-border">
          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="Danh sách thành viên"
          />
          <div className="tab-content border-base-300 bg-base-100 p-10">
            {isLoadUser ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : userGroup ? (
              <MemberGroup
                empData={userGroup}
                feildTable={fieldTable}
                group_id={group.group_id}
              />
            ) : (
              <div className="alert alert-error">Không có dữ liệu</div>
            )}
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="Danh sách quyền"
            defaultChecked
          />
          <div className="tab-content border-base-300 bg-base-100 p-10">
            <ListofRole group_id={group.group_id} roles={roles} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetail;
