"use client";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import RichTextEditor from "~/components/ui/rich-text-editor";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { BugComment, Contact, ProjectMember } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import { formatCommentDate } from "~/utils/format-comment-date";
import { sendEmail } from "~/utils/send-notify";

interface ResponseNotify {
  action: string;
  content: {
    bug_id: number;
    bug_name: string;
    message: string;
  };

  contact: Contact[][];
}
export default function BugComments({
  bug_id,
  product_id,
  comments,
  updateComment,
}: {
  bug_id: number;
  product_id: string;
  comments: BugComment[];
  updateComment: () => Promise<void>;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("\u200B");
  const { data: memberProject, getData: getUsers } = useApi<ProjectMember[]>();
  const { postData, errorData } = useApi<
    ResponseNotify,
    { bug_id: number; comment: string }
  >();
  const { getData: getContact } =
    useApi<{ userid: number; display_name: string; contacts: Contact[] }[]>();
  useEffect(() => {
    getUsers(
      "/system/config/" + encodeBase64({ type: "project_member", product_id })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  const handleAddComment = async () => {
    // API post comment here
    const data = {
      bug_id,
      comment: newComment,
    };
    const list = memberProject?.filter((mem) => {
      return newComment.includes(mem.name);
    });
    const listContact = await getContact(
      "/user/contacts/" +
        encodeBase64({ user_id: list?.map((l) => ({ id: l.id })) })
    );
    if (listContact && listContact.length > 0) {
      const email = listContact.map((us) => {
        const mail = us.contacts.filter((ct) => ct.code == "email");
        return mail[0].value;
      });
      const content = {
        id: bug_id,
        name: `Bạn đã được ${user?.name} nhắc đến trong bug`,
        message: `Nội dung comment: ${DOMPurify.sanitize(newComment)}`,
      };
      const link =
        window.location.origin +
          "/bug/" +
          encodeBase64({ bug_id, product_id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment", link, "bug")
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
    }
    const re = await postData("/bugs/comments", data);
    if (!re) return;
    else {
      const email = re.contact
        ?.flat()
        .filter((ct) => ct.code === "email")
        .map((ct) => ct.value);
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.bug_id,
        name: re.content.bug_name,
        message: newComment,
      };
      const link =
        window.location.origin +
          "/bug/" +
          encodeBase64({ bug_id, product_id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Bình luận mới", link, "bug", user?.name)
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );

      // if (tele)
      //   sendTelegram(content, tele, "Thông báo", link, "bug")
      //     .then((re) => {
      //       toast.success(re.message);
      //     })
      //     .catch((err) => toast.error(err));

      await updateComment();
      setNewComment("");
    }
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [newComment]);
  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-primary mb-2">
          💬 Bình luận
        </h4>
        <div className="border border-amber-100 shadow max-h-96 overflow-y-auto">
          {comments && comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <div className="chat chat-start" key={comment.id}>
                  {/* <div className="chat-header">
                 {comment.name}
                 <time className="text-xs opacity-50">{comment.date}</time>
               </div> */}
                  <div className="chat-bubble wrap-anywhere">
                    <p className="font-bold text-sm">{comment.user_name}</p>
                    <SafeHtmlViewer html={comment.comment} />
                  </div>
                  <div className="chat-footer">
                    <time className="text-xs opacity-50">
                      {formatCommentDate(comment.date)}
                    </time>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-4">Chưa có bình luận nào</div>
          )}
        </div>
        <div className="flex items-start gap-2">
          <div className="avatar avatar-placeholder mt-4">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
              {user ? (
                <span className="text-lg">
                  {user.name.slice(user.name.lastIndexOf(" ") + 1)[0]}
                </span>
              ) : (
                <span className="text-sm">VASD</span>
              )}
            </div>
          </div>
          <div className="join-vertical mt-4 w-full border-dashed border rounded-2xl p-3">
            <RichTextEditor
              value={newComment}
              className="join-item resize-none not-last:focus-visible:outline-none focus-visible:border-none focus-visible:ring-0"
              onChange={(e) => {
                setNewComment(e);
              }}
              placeholder="Nhập bình luận..."
              suggestList={memberProject?.map((mem) => mem.name)}
            />
            {/* <textarea
              ref={textareaRef}
              rows={1}
              className=" break-words overflow-hidden w-full "
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            /> */}
            <div className="join-item flex justify-end">
              <button
                className="btn btn-ghost btn-sm rounded-full"
                onClick={() => {
                  // console.log(newComment);
                  handleAddComment();
                }}
                disabled={
                  newComment.trim().length == 0 || newComment == "<p><br></p>"
                }
                aria-label="Gửi"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
