"use client";
import { useRouter } from "next/navigation";
import { deleteData } from "~/lib/api-client";
import { encodeBase64 } from "~/lib/services";

function RemoveGroupBtn({ group_id }: { group_id: string }) {
  const route = useRouter();
  const handlderClick = async () => {
    const endpoint = "/group/" + encodeBase64({ type: "group", group_id });
    const res = await deleteData({ endpoint });
    if (res.code != 200) window.alert("Lỗi " + res.code + " " + res.message);
    else route.refresh();
  };
  return (
    <button className="btn btn-error" onClick={handlderClick}>
      Xóa
    </button>
  );
}

export default RemoveGroupBtn;
