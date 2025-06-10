"use client";
import { memo, useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { AccountType } from "~/lib/types";
import { toast } from "sonner";
interface DataPut {
  user_id: number;
  account_type: string;
}
function EditTypeModal({
  role,
  userid,
  type,
}: {
  role: string;
  userid: number;
  type: AccountType[];
}) {
  const { putData, errorData } = useApi<"", DataPut>();
  const [typeTemp, setTypeTemp] = useState(role);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleClick = async (code: string) => {
    // Handle click event for account type selection
    const data = await putData("/user/account/type", {
      user_id: userid,
      account_type: code,
    }); // Replace with your logic to handle the selected type
    if (data == "") {
      toast.success("Xử lý thành công");
      setTypeTemp(code);
    }
  }; // Load account type when component mounts
  return (
    <>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          {type?.find((type) => type.code == typeTemp)?.display || typeTemp}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {type?.map((item) => {
            return item.code !== typeTemp ? (
              <li key={item.code}>
                <a onClick={() => handleClick(item.code)}>{item.display}</a>
              </li>
            ) : (
              <li key={item.code} className="menu-disabled">
                <a className="menu-active">{item.display}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default memo(EditTypeModal);
