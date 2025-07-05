/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import RichTextEditor from "~/components/ui/rich-text-editor";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, RequirementNote, UserDto } from "~/lib/types";
import { useUser } from "~/providers/user-context";
import { formatCommentDate } from "~/utils/format-comment-date";
import { sendEmail } from "~/utils/send-notify";

export default function NoteRequirment({
  requirement_id,
  project_id,
  comments,
  onUpdate,
}: {
  requirement_id: number;
  project_id: number;
  comments: RequirementNote[];
  onUpdate: () => Promise<void>;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const { data: users, getData: getUser } = useApi<UserDto[]>();
  const { data: memberProject, getData: getUsers } =
    useApi<{ id: number; display: string }[]>();
  const { postData: postNote, errorData: errorNote } = useApi<
    "",
    {
      requirement_id: number;
      note: string;
    }
  >();
  const { getData: getContact } =
    useApi<{ userid: number; display_name: string; contacts: Contact[] }[]>();
  useEffect(() => {
    getUser("/user/" + encodeBase64({ type: "all" }));
    getUsers("/project/member/" + encodeBase64({ project_id }));
  }, []);
  console.log(memberProject);
  useEffect(() => {
    if (errorNote) toast.error(errorNote.message);
  }, [errorNote]);
  const userList = users?.map((us) => ({
    id: us.userid,
    name: us.userData.display_name,
  }));
  const handleSubmit = async () => {
    const data = {
      requirement_id,
      note: newComment,
    };
    const list = memberProject?.filter((mem) => {
      return newComment.includes(mem.display);
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
        id: requirement_id,
        name: `Bạn đã được ${user?.name} nhắc đến trong ghi nhận yêu cầu`,
        massage: `Nội dung comment: ${DOMPurify.sanitize(newComment)}`,
      };
      const link =
        window.location.origin +
          "/requirement/" +
          encodeBase64({ requirement_id, project_id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(
            content,
            e,
            "Thông báo ghi chú mới",
            link,
            "Ghi nhận yêu cầu"
          )
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
    }
    const re = await postNote("/requirements/note", data);
    if (re == null) {
      return;
    } else {
      await onUpdate();
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
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">💬 Bình luận</h3>
      <div className="space-y-2 mb-4 max-h-96 overflow-auto">
        {comments ? (
          comments.map((comment) => {
            return (
              <div className="chat chat-start" key={comment.date}>
                {/* <div className="chat-header">
                 {comment.name}
                 <time className="text-xs opacity-50">{comment.date}</time>
               </div> */}
                <div className="chat-bubble wrap-break-word">
                  <p className="font-bold text-sm">
                    {userList
                      ? userList.find((us) => us.id == comment.user_id)?.name
                      : comment.user_id}
                  </p>
                  <SafeHtmlViewer html={comment.note} />
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
          <div className="text-base-200 text-center">Chưa có bình luận nào</div>
        )}
      </div>
      <div className="flex items-start gap-2">
        <div className="avatar avatar-placeholder mt-4">
          <div className="bg-neutral text-neutral-content w-8 rounded-full">
            <span className="text-lg">
              {user?.name.slice(user.name.lastIndexOf(" ") + 1)[0] || "VASD"}
            </span>
          </div>
        </div>
        <div className="join-vertical mt-4 w-full border-dashed border rounded-2xl p-3">
          <RichTextEditor
            value={newComment}
            className="join-item resize-none not-last:focus-visible:outline-none focus-visible:border-none focus-visible:ring-0"
            onChange={(e) => setNewComment(e)}
            placeholder="Nhập bình luận..."
            suggestList={memberProject?.map((mem) => mem.display)}
          />
          <div className="join-item flex justify-end">
            <button
              className="btn btn-ghost btn-sm rounded-full"
              onClick={handleSubmit}
              disabled={newComment.trim().length == 0}
              aria-label="Gửi"
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
