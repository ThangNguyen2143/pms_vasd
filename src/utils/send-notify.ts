import { postItem } from "~/lib/services";

type Content = {
  id: number;
  name: string;
  message: string;
};
const bodyEmailHtml = (
  type: string,
  action: string,
  id: number,
  name: string,
  content: string,
  link: string,
  by?: string
) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset='UTF-8'>
    <title>Email Notify</title>
  </head>
  <body>
    <div style='display:flex; justify-content:center;text-align:center;gap:5px;'>
      <img src='https://pm.vasd.vn/icon.png?a939bbf917091023' alt='VASD' style='width:80px;height:80px;'>
      <h2>${action}</h2>
    </div>
    <p>Có cập nhật mới:</p>
    <h1 style='font-size: 24px;'>${type} id [${id}]: ${name}</h1>
    ${by}
    ${content}
    <div style='text-align: center; margin: 20px 0;'>
      <a href='${link}'style='display: inline-block; padding: 10px 20px; background-color: #1eeafd; color: #ffeeee; text-decoration: none; border-radius: 6px; font-weight: bold; font-family: sans-serif;'>
        Truy cập
      </a>
    </div>
    <hr>
    <p style='font-size: 12px'> CÔNG TY TNHH MỘT THÀNH VIÊN VASD<br>  
      Địa chỉ: 54/11a, Đường Trần Việt Châu, Thới Bình, Ninh Kiều, Cần Thơ<br> 
      Hotline: 0396 116 119<br> 
      Bản quyền &copy; 2024 thuộc về Công ty Trách nhiệm hữu hạn Một thành viên VASD Co.,Ltd
    </p>
  </body>
</html>

`;

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
    `. Cập nhật mới: ${content.message}. link: ${link}`;
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
  type: string,
  createBy?: string
) {
  const data = {
    receiver_email: email,
    subject: action + ": " + type,
    body: bodyEmailHtml(
      type,
      action,
      content.id,
      content.name,
      content.message,
      link,
      createBy
    ),
  };
  const res = await postItem({
    endpoint: "/notification/email",
    data: JSON.stringify(data),
  });
  if (res.code == 200) return { message: "OK" };
  else return { message: "Lỗi gửi thông báo email" };
}
export { sendEmail, sendTelegram };
