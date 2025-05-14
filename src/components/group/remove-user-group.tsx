"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateData } from "~/lib/api-client";

function RemoveUserGroup({
  user_code,
  group_id,
}: {
  user_code: string;
  group_id: string;
}) {
  const route = useRouter();
  const handlerCick = async () => {
    const dataSend = {
      group_id,
      user_code,
      type: "remove",
    };
    const res = await updateData<
      "",
      { type: string; group_id: string; user_code: string }
    >({ endpoint: "/group/user", data: dataSend });
    if (res.code != 200) window.alert("Lỗi " + res.code + " " + res.message);
    else {
      route.refresh();
    }
  };
  return (
    <button
      onClick={handlerCick}
      aria-label="Xóa thành viên"
      className="btn btn-ghost"
    >
      <X color="#fc0303" />
    </button>
  );
}

export default RemoveUserGroup;
