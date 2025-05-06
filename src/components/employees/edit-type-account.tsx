"use client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useApi } from "~/hooks/use-api";
import { AccountType } from "~/lib/type";
import ErrorMessage from "../ui/error-message";
interface DataPut {
  user_id: number;
  account_type: string;
}
function EditTypeModal({
  display,
  accountType,
  userid,
}: {
  display: string;
  accountType?: AccountType[];
  userid: number;
}) {
  const router = useRouter();
  const { putData, errorData, isErrorDialogOpen, setIsErrorDialogOpen } =
    useApi<"", DataPut>();
  const handleClick = async (dis: string) => {
    // Handle click event for account type selection
    const selectedType = accountType?.find((item) => item.display === dis);
    if (selectedType) {
      const data = await putData("/user/account/type", {
        user_id: userid,
        account_type: selectedType.code,
      }); // Replace with your logic to handle the selected type
      if (data) {
        router.refresh(); // Refresh the page to reflect the changes
      } else setIsErrorDialogOpen(true); // Show error dialog if there's an error
    }
  }; // Load account type when component mounts
  return (
    <>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          {display}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          {accountType?.map((item) => {
            return item.display !== display ? (
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
