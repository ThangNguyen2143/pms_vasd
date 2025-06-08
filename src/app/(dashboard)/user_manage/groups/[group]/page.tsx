import { decodeBase64 } from "~/lib/services";
import { GroupDto } from "~/lib/types/account";
import GroupDetail from "~/components/group/group-detail";

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
    status: "active",
  };

  return <GroupDetail group={group} />;
}

export default DetailGroupPage;
