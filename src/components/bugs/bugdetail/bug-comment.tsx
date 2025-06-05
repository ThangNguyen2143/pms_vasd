"use client";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { BugComment, Contact } from "~/lib/types";
import { useUser } from "~/providers/user-context";
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
  const [newComment, setNewComment] = useState("");
  const { postData, errorData } = useApi<
    ResponseNotify,
    { bug_id: number; comment: string }
  >();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleAddComment = async () => {
    // API post comment here
    const data = {
      bug_id,
      comment: newComment,
    };
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
        massage: re.content.message,
      };
      const link =
        window.location.origin +
          "/bugs/" +
          encodeBase64({ bug_id, product_id }) || "https://pm.vasd.vn/";
      if (email.length > 0)
        email.forEach((e) =>
          sendEmail(content, e, "Thông báo comment", link, "bug")
            .then((mes) => toast(mes.message))
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
