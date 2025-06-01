"use client";
import { memo, useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { AccountType } from "~/lib/types";
import ErrorMessage from "../ui/error-message";
import { encodeBase64 } from "~/lib/services";
import { toast } from "sonner";
interface DataPut {
  user_id: number;
  account_type: string;
}
function EditTypeModal({
  role,
  userid,
  onUpdate,
}: {
  role: string;
  userid: number;
  onUpdate: () => Promise<void>;
}) {
  const { putData, errorData, isErrorDialogOpen, setIsErrorDialogOpen } =
    useApi<"", DataPut>();
  const {
    data: accountType,
    getData: getUserType,
    errorData: errorType,
  } = useApi<AccountType[]>();
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
  const handleClick = async (dis: string) => {
    // Handle click event for account type selection
    const selectedType = accountType?.find((item) => item.display === dis);
    if (selectedType) {
      const data = await putData("/user/account/type", {
        user_id: userid,
        account_type: selectedType.code,
      }); // Replace with your logic to handle the selected type
      if (data != "") {
        toast.success("Xử lý thành công");
        await onUpdate();
      } else setIsErrorDialogOpen(true); // Show error dialog if there's an error
    }
  }; // Load account type when component mounts
  return (
    <>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          {accountType?.find((type) => type.code == role)?.display || role}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {accountType?.map((item) => {
            return item.code !== role ? (
              <li key={item.code}>
                <a onClick={(e) => handleClick(e.currentTarget.innerHTML)}>
                  {item.display}
                </a>
              </li>
            ) : (
              <li key={item.code} className="menu-disabled">
                <a className="menu-active">{item.display}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <ErrorMessage
        errorData={errorData}
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
      />
    </>
  );
}

export default memo(EditTypeModal);
