/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { RequirementNote, UserDto } from "~/lib/types";

export default function NoteRequirment({
  requirement_id,
  comments,
  onUpdate,
}: {
  requirement_id: number;
  comments: RequirementNote[];
  onUpdate: () => Promise<void>;
}) {
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
  const userList = users?.map((us) => ({
    id: us.userid,
    name: us.userData.display_name,
  }));
  const handleSubmit = async () => {
    const data = {
      requirement_id,
      note: newComment,
    };
    postNote("/requirements/note", data);
    if (errorNote) {
      toast.error(errorNote.message);
      console.log(errorNote);
    } else {
      await onUpdate();
      setNewComment("");
    }
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-primary mb-2">💬 Bình luận</h3>
      <div className="space-y-2 mb-4">
        {comments ? (
          comments.map((comment) => {
            return (
              <div className="chat chat-start" key={comment.date}>
                {/* <div className="chat-header">
                 {comment.name}
                 <time className="text-xs opacity-50">{comment.date}</time>
               </div> */}
                <div className="chat-bubble">
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
          <div className="text-base-200 text-center">Chưa có ghi chú nào</div>
        )}
      </div>
      <div className="flex gap-2 items-start">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Thêm ghi chú..."
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Gửi
        </button>
      </div>
    </div>
  );
}
