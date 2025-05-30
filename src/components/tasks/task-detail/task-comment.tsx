"use client";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Comment, ResopnseInfor, Task } from "~/lib/types";
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
  const [newComment, setNewComment] = useState("");
  const { postData, isLoading, errorData } = useApi<
    ResopnseInfor,
    { task_id: number; content: string }
  >();

  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleAddComment = async () => {
    // API post comment here
    const data = {
      task_id: task.task_id,
      content: newComment,
    };
    const re = await postData("/tasks/comments", data);
    if (!re) return;
    else {
      const email = re.list_contacts.email;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: task.task_id,
        name: task.title,
        massage: "Có bình luận mới",
      };
      const link =
        window.location.origin +
          "/tasks/" +
          encodeBase64({
            task_id: task.task_id,
            product_id: task.product_id,
          }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment mới", link, "task")
            .then((mes) => toast(mes.message))
            .catch((e) => toast.error(e))
        );
      await onUpdate();
      setNewComment("");
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="mt-4">
        <h4 className="text-lg font-semibold text-primary mb-2">
          💬 Bình luận
        </h4>
        <div className="border border-amber-100 shadow">
          {comments ? (
            comments.map((comment) => {
              return (
                <div className="chat chat-start" key={comment.id}>
                  {/* <div className="chat-header">
                    {comment.name}
                    <time className="text-xs opacity-50">{comment.date}</time>
                  </div> */}
                  <div className="chat-bubble">
                    <p className="font-bold text-sm">{comment.name}</p>
                    <p className="text-lg mt-0.5 mx-2">{comment.content}</p>
                  </div>
                  <div className="chat-footer">
                    <time className="text-xs opacity-50">{comment.date}</time>
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
              <span className="text-lg">A</span>
            </div>
          </div>
          <div className="join-vertical mt-4 w-full border-dashed border rounded-2xl p-3">
            <input
              className="join-item w-full focus-visible:outline-none focus-visible:border-none focus-visible:ring-0"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="join-item flex justify-end">
              <button
                className="btn btn-ghost btn-sm rounded-full"
                onClick={handleAddComment}
                aria-label="Gửi"
                disabled={isLoading}
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
