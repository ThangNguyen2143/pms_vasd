import { Comment } from "~/lib/types";

function TaskComments({ comments }: { comments?: Comment[] }) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold">Bình luận</h4>
      <div className="border border-amber-100 shadow">
        {comments &&
          comments.map((comment) => {
            return (
              <div className="chat chat-start" key={comment.id}>
                <div className="chat-header">
                  {comment.name}
                  <time className="text-xs opacity-50">{comment.date}</time>
                </div>
                <div className="chat-bubble">{comment.content}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TaskComments;
