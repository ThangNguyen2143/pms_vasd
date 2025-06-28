"use client";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import RichTextEditor from "~/components/ui/rich-text-editor";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, ProjectMember, TestComment } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import { formatCommentDate } from "~/utils/format-comment-date";
import { sendEmail } from "~/utils/send-notify";
interface ResponseNotify {
  action: string;
  content: {
    testcase_id: number;
    testcase_name: string;
    message: string;
  };

  contact: Contact[][];
}
function CommentTestcase({
  testcase_id,
  product_id,
  comments,
  updateComment,
}: {
  testcase_id: number;
  product_id: string;
  comments: TestComment[];
  updateComment: () => Promise<void>;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const { postData, errorData } = useApi<
    ResponseNotify,
    { testcase_id: number; message: string }
  >();

  const { data: memberProject, getData: getUsers } = useApi<ProjectMember[]>();
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
      testcase_id,
      message: newComment,
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
        id: testcase_id,
        name: "Bạn đã được nhắc đến trong testcase",
        massage: `Nội dung comment: ${DOMPurify.sanitize(newComment)}`,
      };
      const link =
        window.location.origin +
          "/test_case/" +
          encodeBase64({ testcase_id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment", link, "testcase")
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
    }
    const re = await postData("/testcase/comments", data);
    if (!re) return;
    else {
      const email = re.contact
        ?.flat()
        .filter((ct) => ct.code === "email")
        .map((ct) => ct.value);
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.testcase_id,
        name: re.content.testcase_name,
        massage: re.content.message,
      };
      const link =
        window.location.origin +
          "/test_case/" +
          encodeBase64({ testcase_id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment", link, "Testcase")
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
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
          {comments ? (
            comments.map((comment) => {
              return (
                <div className="chat chat-start" key={comment.id}>
                  {/* <div className="chat-header">
                 {comment.name}
                 <time className="text-xs opacity-50">{comment.date}</time>
               </div> */}
                  <div className="chat-bubble wrap-anywhere">
                    <p className="font-bold text-sm">{comment.name}</p>
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
            <div className="text-base-200 text-center">
              Chưa có bình luận nào
            </div>
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
              onChange={(e) => setNewComment(e)}
              placeholder="Nhập bình luận..."
              suggestList={memberProject?.map((mem) => mem.name)}
            />
            <div className="join-item flex justify-end">
              <button
                className="btn btn-ghost btn-sm rounded-full"
                onClick={handleAddComment}
                disabled={newComment.trim().length == 0}
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

export default CommentTestcase;
