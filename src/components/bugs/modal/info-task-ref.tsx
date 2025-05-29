import { useEffect } from "react";
import TaskInfo from "~/components/tasks/task-detail/info-task";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Task } from "~/lib/types";

function InforTaskRef({
  task_id,
  onClose,
}: {
  task_id: number;
  onClose: () => void;
}) {
  const { data, getData, errorData, isLoading } = useApi<Task>();
  useEffect(() => {
    getData("/tasks/detail/" + encodeBase64({ type: "info", task_id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task_id]);
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="mockup-browser border-base-300 border w-full">
          <div className="mockup-browser-toolbar">
            <div className="input">Task info</div>
          </div>
          <div className="grid place-content-center border-t border-base-300 h-80">
            {isLoading ? (
              <span className="loading loading-infinity"></span>
            ) : data ? (
              <TaskInfo
                task={data}
                onAssign={() => {}}
                onEdit={() => {}}
                onLinkRequirement={() => {}}
                hidden_button
              />
            ) : (
              errorData?.message
            )}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
}

export default InforTaskRef;
