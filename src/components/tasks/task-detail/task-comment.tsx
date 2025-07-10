"use client";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import RichTextEditor from "~/components/ui/rich-text-editor";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import {
  Comment,
  Contact,
  ProjectMember,
  ResopnseInfor,
  Task,
} from "~/lib/types";
import { useUser } from "~/providers/user-context";
import { formatCommentDate } from "~/utils/format-comment-date";
import { sendEmail } from "~/utils/send-notify";

function TaskComments({
  comments,
  task,
  onUpdate,
}: {
  comments?: Comment[];
  task: Task;
  onUpdate: () => Promise<void>;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const { postData, isLoading, errorData } = useApi<
    ResopnseInfor,
    { task_id: number; content: string }
  >();

  const { data: memberProject, getData: getUsers } = useApi<ProjectMember[]>();
  const { getData: getContact } =
    useApi<{ userid: number; display_name: string; contacts: Contact[] }[]>();
  useEffect(() => {
    getUsers(
      "/system/config/" +
        encodeBase64({ type: "project_member", product_id: task.product_id })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content || content.length == 0) {
      toast.info("Chưa nhập kí tự nào");
      return;
    }
    // API post comment here
    const data = {
      task_id: task.task_id,
      content: newComment.trim(),
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
        id: task.id,
        name: `Bạn đã được ${user?.name} nhắc đến trong task`,
        message: `Nội dung comment: ${DOMPurify.sanitize(newComment)}`,
      };
      const link =
        window.location.origin +
          "/task/" +
          encodeBase64({ task_id: task.id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment", link, "task", user?.name)
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
    }
    const re = await postData("/tasks/comments", data);
    if (!re) return;
    else {
      const email = re.list_contacts.email;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: task.task_id,
        name: task.title,
        message: newComment,
      };
      const link =
        window.location.origin +
          "/task/" +
          encodeBase64({
            task_id: task.task_id,
          }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment mới", link, "task")
            .then((mes) => {
              if (mes.message != "OK") toast(mes.message);
            })
            .catch((e) => toast.error(e))
        );
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
    <div className="bg-base-200 rounded-lg p-4">
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-primary mb-2">
          💬 Bình luận
        </h4>
        <div className="border border-amber-100 shadow max-h-[400px] overflow-y-auto p-2 rounded-lg">
          {comments && comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <div className="chat chat-start" key={comment.id}>
                  <div className="chat-bubble wrap-anywhere">
                    <p className="font-bold text-sm">{comment.name}</p>
                    <SafeHtmlViewer html={comment.content} />
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
            <div className="text-center">Chưa có bình luận nào</div>
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
                aria-label="Gửi"
                disabled={isLoading || newComment.trim().length == 0}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Send />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskComments;
