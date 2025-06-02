"use client";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateData } from "~/lib/api-client";
type statusDto = {
  id: number;
  isActive: boolean;
};
function StatusBtn({
  isLocked,
  idUser,
}: {
  isLocked: boolean;
  idUser: number;
}) {
  const [locked, setIsLocked] = useState(isLocked);
  const handleClick = async () => {
    const res = await updateData<"", statusDto>({
      endpoint: "/user/status",
      data: {
        id: idUser,
        isActive: isLocked,
      },
    });
    if (res.code === 200) {
      toast.success("Xử lý thành công");
      setIsLocked(!locked);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <button className="btn" onClick={handleClick}>
      {locked ? <Lock color="#ff0" /> : <LockOpen color="#0f0" />}
    </button>
  );
}

export default StatusBtn;
