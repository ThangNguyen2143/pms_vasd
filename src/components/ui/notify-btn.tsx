import { Bell } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact } from "~/lib/types";
import { sendEmail } from "~/utils/send-notify";

function NotifyBtn({
  url,
  type,
  content,
  user_id,
  className = "",
}: {
  type: string;
  className?: string;
  url: string;
  content: { id: number; name: string; message: string };
  user_id: number;
}) {
  const { getData: getContact } =
    useApi<{ userid: number; display_name: string; contacts: Contact[] }[]>();
  const handleNotify = async () => {
    const listContact = await getContact(
      "/user/contacts/" + encodeBase64({ user_id: [{ id: user_id }] })
    );
    if (!listContact || listContact.length == 0) {
      toast.error("Không thể tải liên hệ người dùng");
      return;
    }
    const email = listContact.map((us) => {
      const mail = us.contacts.filter((ct) => ct.code == "email");
      return mail[0].value;
    });
    const link = window.location.hostname + url;
    await sendEmail(content, email[0], "Nhắc nhở", link, type)
      .then((mes) => {
        if (mes.message != "OK") toast(mes.message);
        else {
          toast.success("Gửi thông báo thành công");
        }
      })
      .catch((e) => toast.error(e));
  };

  return (
    <button
      className={
        "btn btn-circle tooltip btn-secondary btn-outline " + className
      }
      data-tip={"Nhắc nhở"}
      onClick={handleNotify}
    >
      <Bell />
    </button>
  );
}

export default NotifyBtn;
