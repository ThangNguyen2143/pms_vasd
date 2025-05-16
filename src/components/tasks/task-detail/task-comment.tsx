"use client";
import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Comment } from "~/lib/types";

function TaskComments({
  comments,
  task_id,
}: {
  comments?: Comment[];
  task_id: number;
}) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    // API post comment here
    console.log("Gửi bình luận:", newComment, task_id);
    setNewComment("");
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
            <div className="join-item flex justify-between">
              <div>
                <div className="tooltip tooltip-bottom" data-tip="Tệp đính kèm">
                  <Paperclip />
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm rounded-full"
                onClick={handleAddComment}
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

export default TaskComments;
