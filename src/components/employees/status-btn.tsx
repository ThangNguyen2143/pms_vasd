"use client";
import { Lock, LockOpen } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const route = useRouter();
  // const [locked, setIsLocked] = useState(isLocked);
  const handleClick = async () => {
    const res = await updateData<"", statusDto>({
      endpoint: "/user/status",
      data: {
        id: idUser,
        isActive: !isLocked,
      },
    });
    if (res.code === 200) {
      route.refresh();
    } else {
      toast.error("Failed to update status");
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
