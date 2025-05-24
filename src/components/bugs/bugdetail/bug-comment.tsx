"use client";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { BugComment } from "~/lib/types";

interface ResponseNotify {
  action: string;
  content: {
    bug_id: number;
    bug_name: string;
    message: string;
  };

  contact: {
    email: string;
    telegram: string;
  }[];
}
export default function BugComments({
  bug_id,
  comments,
  updateComment,
}: {
  bug_id: number;
  comments: BugComment[];
  updateComment: () => Promise<void>;
}) {
  const [newComment, setNewComment] = useState("");
  const {
    data: inforNotify,
    postData,
    errorData,
  } = useApi<ResponseNotify, { bug_id: number; comment: string }>();
  const handleAddComment = async () => {
    // API post comment here
    const data = {
      bug_id,
      comment: newComment,
    };
    postData("/bugs/comments", data);
    console.log("Gửi bình luận:", data);
    if (errorData) toast.error(errorData.message);
    else {
      console.log(inforNotify);
      await updateComment();
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
                    <p className="font-bold text-sm">{comment.user_name}</p>
                    <p className="text-lg mt-0.5 mx-2">{comment.comment}</p>
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
