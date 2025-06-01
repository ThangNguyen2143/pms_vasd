"use client";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { updateData } from "~/lib/api-client";
type resetPwDto = {
  username: string;
};
function ResetPassBtn({
  username,
  onUpdate,
}: {
  username: string;
  onUpdate: () => Promise<void>;
}) {
  const handleClick = async () => {
    const res = await updateData<"", resetPwDto>({
      endpoint: "/user/pass/reset",
      data: {
        username,
      },
    });
    if (res.code === 200) {
      toast.success(res.message);
      await onUpdate();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <button className="btn" onClick={handleClick}>
      <RefreshCcw color="#000" />
    </button>
  );
}

export default ResetPassBtn;
