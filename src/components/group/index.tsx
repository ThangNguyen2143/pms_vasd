/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { encodeBase64 } from "~/lib/services";
import { GroupDto } from "~/lib/types";
import Group_Table from "./group-table";
import { useApi } from "~/hooks/use-api";
import { useEffect } from "react";

function GroupTab() {
  const endpoint = "/group/" + encodeBase64({ type: "all" });
  const { data: listGroup, getData, errorData } = useApi<GroupDto[]>();
  useEffect(() => {
    getData(endpoint, "reload");
  }, []);
  const fieldTable = [
    {
      code: "group_name",
      display: "Tên nhóm",
    },
    {
      code: "group_description",
      display: "Mô tả",
    },
    {
      code: "status",
      display: "Trạng thái",
    },
    {
      code: "group_id",
      display: "Thao tác",
    },
    {
      code: "group_id",
      display: "Xóa",
    },
  ];
  if (errorData?.code !== 200) {
    return <div className="alert alert-error">{errorData?.message}</div>;
  }
  if (listGroup)
    return <Group_Table groupData={listGroup} feildTable={fieldTable} />;
  else {
    <progress className="progress w-56"></progress>;
  }
}
export default GroupTab;
