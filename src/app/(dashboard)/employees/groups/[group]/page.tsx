import AddMemberBtn from "~/components/group/add-member-btn";
import MemberGroup from "~/components/group/member-group";
import UpdateInfoGroup from "~/components/group/update-info-group";
import ListofRole from "~/components/employees/list-role";
import { fetchData } from "~/lib/api-client";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { RoleType, UserDto } from "~/lib/types/account";
interface GroupDto {
  group_id: string;
  group_name: string;
  group_description: string;
}
interface UserInGroup {
  user_code: string;
  display_name: string;
  date_join: string;
}

async function DetailGroupPage(props: {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const searchParam = await props.searchParams;
  const name = searchParam.group_name;
  const description = searchParam.group_description;
  if (!params.group) {
    return <div className="alert alert-warning">Không tìm thấy nhóm</div>;
  }
  const groupId = (decodeBase64(params.group) as { group_id: string }).group_id;
  const group: GroupDto = {
    group_id: groupId,
    group_name: name,
    group_description: description,
  };
  const roleRespone = await fetchData<RoleType[]>({
    endpoint: "/system/config/eyJ0eXBlIjoicm9sZSJ9",
    cache: "force-cache",
  });
  const endpointUserGroup =
    "/group/" +
    encodeBase64({
      type: "group",
      kind: "user",
      group_id: group.group_id,
    });
  const userGroupResponse = await fetchData<UserInGroup[]>({
    endpoint: endpointUserGroup,
    cache: "no-cache",
  });
  const endpointRoleGroup =
    "/group/role/" +
    encodeBase64({
      type: "role",
      group_id: group.group_id,
    });
  const roleGroupResponse = await fetchData<RoleType[]>({
    endpoint: endpointRoleGroup,
    cache: "no-cache",
  });
  if (roleGroupResponse.code == 404) roleGroupResponse.value = [];
  const endpoint = "/user/" + encodeBase64({ type: "all" });
  const listEmployee = await fetchData<UserDto[]>({
    endpoint,
    cache: "default",
  });
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
    <div className="container p-4 justify-center">
      <div className="p-4 m-2 min-w-96 max-w-5xl flex items-center flex-col">
        <h1 className="p-4 text-2xl">{group.group_name}</h1>
        <p className="p-4 text-xl">Mô tả: {group.group_description}</p>
        <div className="flex gap-3">
          <AddMemberBtn
            group_id={group.group_id}
            listEmployee={listEmployee.value}
            memberGroup={userGroupResponse.value}
          />
          <UpdateInfoGroup group={group} />
        </div>
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
            <MemberGroup
              empData={userGroupResponse.value}
              feildTable={fieldTable}
              group_id={group.group_id}
            />
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="Danh sách quyền"
            defaultChecked
          />
          <div className="tab-content border-base-300 bg-base-100 p-10">
            <ListofRole
              roleOwn={roleGroupResponse.value}
              roleList={roleRespone.value}
              group_id={group.group_id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailGroupPage;
