"use client";
import { memo, useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { AccountType } from "~/lib/types";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";
interface DataPut {
  user_id: number;
  account_type: string;
}
function EditTypeModal({ role, userid }: { role: string; userid: number }) {
  const { putData, errorData } = useApi<"", DataPut>();
  const {
    data: accountType,
    getData: getUserType,
    errorData: errorType,
  } = useApi<AccountType[]>();
  const [typeTemp, setTypeTemp] = useState(role);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  useEffect(() => {
    getUserType(
      "/system/config/" + encodeBase64({ type: "account_type" }),
      "force-cache"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorType) toast.error(errorType.message);
  }, [errorType]);
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
          {accountType?.find((type) => type.code == typeTemp)?.display ||
            typeTemp}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {accountType?.map((item) => {
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
