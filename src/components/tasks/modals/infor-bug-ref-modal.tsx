"use client";
import { useEffect } from "react";
import BugInfo from "~/components/bugs/bugdetail/bug-info";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { BugDetail, BugStatus } from "~/lib/types";

function InforBugRefModal({
  bug_id,
  onClose,
}: {
  bug_id: number;
  onClose: () => void;
}) {
  const { data, getData, errorData, isLoading } = useApi<BugDetail>();
  const { data: statusList, getData: getStatus } = useApi<BugStatus[]>();
  useEffect(() => {
    getData("/bugs/detail/" + encodeBase64({ bug_id }));
    getStatus("/system/config/eyJ0eXBlIjoiYnVnX3N0YXR1cyJ9", "default");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bug_id]);
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="mockup-browser border-base-300 border w-full">
          <div className="mockup-browser-toolbar">
            <div className="input">Bug info</div>
          </div>
          <div className="grid place-content-center border-t border-base-300 h-80 overflow-auto">
            {isLoading ? (
              <span className="loading loading-infinity"></span>
            ) : data ? (
              <BugInfo
                bug={data}
                bug_status={statusList || []}
                onAssign={() => {}}
                onEdit={() => {}}
                onLinkRequirement={() => {}}
                onUpdate={async () => {}}
                hiddenButton
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

export default InforBugRefModal;
