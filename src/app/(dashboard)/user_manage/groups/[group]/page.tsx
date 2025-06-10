import { decodeBase64, encodeBase64 } from "~/lib/services";
import { GroupDto, RoleType } from "~/lib/types/account";
import GroupDetail from "~/components/group/group-detail";
import { fetchData } from "~/lib/api-client";
const fetchRole = async () => {
  const result = await fetchData<RoleType[]>({
    endpoint: "/system/config/" + encodeBase64({ type: "role" }),
  });
  if (result.code == 200) return result.value;
  else return [];
};
async function DetailGroupPage(props: {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const searchParam = await props.searchParams;
  const name = searchParam.group_name;
  const description = searchParam.group_description;
  const roles = await fetchRole();
  if (!params.group) {
    return <div className="alert alert-warning">Không tìm thấy nhóm</div>;
  }
  const groupId = (decodeBase64(params.group) as { group_id: string }).group_id;
  const group: GroupDto = {
    group_id: groupId,
    group_name: name,
    group_description: description,
    status: "active",
  };

  return <GroupDetail group={group} roles={roles} />;
}

export default DetailGroupPage;
