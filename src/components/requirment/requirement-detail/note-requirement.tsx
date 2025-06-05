/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementNote, UserDto } from "~/lib/types";
import { useUser } from "~/providers/user-context";

export default function NoteRequirment({
  requirement_id,
  comments,
  onUpdate,
}: {
  requirement_id: number;
  comments: RequirementNote[];
  onUpdate: () => Promise<void>;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const { data: users, getData: getUser, errorData } = useApi<UserDto[]>();
  const { postData: postNote, errorData: errorNote } = useApi<
    "",
    {
      requirement_id: number;
      note: string;
    }
  >();
  useEffect(() => {
    getUser("/user/" + encodeBase64({ type: "all" }));
    if (errorData) {
      toast.error(errorData.message);
    }
  }, []);
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
    const re = await postNote("/requirements/note", data);
    if (re != "") {
      return;
    } else {
      await onUpdate();
      setNewComment("");
    }
  };
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
                  <p className="text-lg mt-0.5 mx-2">{comment.note}</p>
                </div>
                <div className="chat-footer">
                  <time className="text-xs opacity-50">{comment.date}</time>
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
          <input
            className="join-item w-full focus-visible:outline-none focus-visible:border-none focus-visible:ring-0"
            placeholder="Viết bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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
