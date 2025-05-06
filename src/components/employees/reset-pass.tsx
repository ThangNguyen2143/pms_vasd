"use client";
import { RefreshCcw } from "lucide-react";
import { updateData } from "~/lib/api-client";
type resetPwDto = {
  username: string;
};
function ResetPassBtn({ username }: resetPwDto) {
  const handleClick = async () => {
    console.log(username);
    const res = await updateData<"", resetPwDto>({
      endpoint: "/user/pass/reset",
      data: {
        username,
      },
    });
    console.log(res);
    if (res.code === 200) {
      document.getElementById("modal_success")?.click();
    } else {
      window.alert("Lỗi " + res.code + res.message);
    }
  };

  return (
    <button className="btn" onClick={handleClick}>
      <RefreshCcw color="#000" />
    </button>
  );
}

export default ResetPassBtn;
