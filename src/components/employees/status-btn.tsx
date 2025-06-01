"use client";
import { Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";
import { updateData } from "~/lib/api-client";
type statusDto = {
  id: number;
  isActive: boolean;
};
function StatusBtn({
  isLocked,
  idUser,
  onUpdate,
}: {
  isLocked: boolean;
  idUser: number;
  onUpdate: () => Promise<void>;
}) {
  // const [locked, setIsLocked] = useState(isLocked);
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
      await onUpdate();
    } else {
      toast.error(res.message);
    }
  };
  if (isLocked)
    return (
      <button className="btn" onClick={handleClick}>
        <Lock color="#ff0" />
      </button>
    );
  else
    return (
      <button className="btn" onClick={handleClick}>
        <LockOpen color="#0f0" />
      </button>
    );
}

export default StatusBtn;
