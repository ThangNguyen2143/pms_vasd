import { postItem } from "~/lib/services";

type Content = {
  id: number;
  name: string;
  massage: string;
};
async function sendTelegram(
  content: Content,
  tele_id: string,
  action: string,
  link: string,
  type: string
) {
  const parseToMessage =
    action +
    " " +
    type +
    " [#" +
    content.id +
    "] " +
    content.name +
    `. Cập nhật mới: ${content.massage}. link: ${link}`;
  const res = await postItem({
    endpoint: "/notification/telegram",
    data: JSON.stringify({ message: parseToMessage, chatId: tele_id }),
  });
  if (res.code == 200) return { message: "Đã gửi thông báo telegram" };
  else return { message: "Lỗi gửi thông báo telegram" };
}
async function sendEmail(
  content: Content,
  email: string,
  action: string,
  link: string,
  type: string
) {
  const data = {
    receiver_email: email,
    subject: action + ": " + content.name,
    body: `${type} #[${content.id}] ${content.name} - ${content.massage} `,
    link,
  };
  const res = await postItem({
    endpoint: "/notification/email",
    data: JSON.stringify(data),
  });
  if (res.code == 200) return { message: "Đã gửi thông báo email" };
  else return { message: "Lỗi gửi thông báo email" };
}
export { sendEmail, sendTelegram };
