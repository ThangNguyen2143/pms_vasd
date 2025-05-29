"use client";
import { CheckCheck, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Contact, ProjectTimeLineDetail, UserDto } from "~/lib/types";
import { sendEmail } from "~/utils/send-notify";
interface ResponseNotify {
  action: string;
  content: {
    timeline_id: number;
    timeline_name: string;
    message: string;
  };
  contact: Contact[];
}
export default function TimelineDetailModal({
  timeline_id,
  onClose,
  onUpdate,
}: {
  timeline_id: number;
  onClose: () => void;
  onUpdate: (phase_id: number) => Promise<void>;
}) {
  const [userSelected, setUserSelected] = useState(0);
  const {
    getData: getTimeLine,
    data: timeline,
    isLoading,
  } = useApi<ProjectTimeLineDetail>();
  const { getData: getUser, data: users } = useApi<UserDto[]>();
  const {
    putData,
    isLoading: loadingPut,
    errorData,
  } = useApi<ResponseNotify, { timeline_id: number; user_id: number }>();

  const {
    putData: updateStatus,
    isLoading: updateLoading,
    errorData: errorUpdateStatus,
  } = useApi<string, { timeline_id: number; status: string }>();
  useEffect(() => {
    getTimeLine("/project/timeline/detail/" + encodeBase64({ timeline_id }));
    getUser("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline_id]);
  const updateTimeLineData = async () => {
    await getTimeLine("/project/timeline/" + encodeBase64({ timeline_id }));
  };
  const handleAssign = async () => {
    if (!timeline) return;
    const dataSend = {
      timeline_id,
      user_id: userSelected,
    };
    const re = await putData("/project/timeline/assign", dataSend);
    if (re) {
      toast.success("Xử lý thành công");
      const email = re.contact.find((ct) => ct.code == "email")?.value;
      // const tele = re.contact.find((ct) => ct.code == "telegram")?.value;
      const content = {
        id: re.content.timeline_id,
        name: re.content.timeline_name,
        massage: re.content.message,
      };
      const link =
        window.location.origin +
          "/project/" +
          encodeBase64({ project_id: timeline.project_id }) ||
        "https://pm.vasd.vn/";
      if (email)
        toast(
          (await sendEmail(content, email, "Thông báo", link, "timeline"))
            .message
        );
      // if (tele)
      //   sendTelegram(content, tele, "Thông báo", link, "task")
      //     .then((re) => {
      //       toast.success(re.message);
      //     })
      //     .catch((err) => toast.error(err));

      await onUpdate(timeline.phase_id);
      await updateTimeLineData();
    } else return;
  };
  const handlerUpdateStatus = async (status: string) => {
    const re = await updateStatus("/project/timeline/status", {
      timeline_id,
      status,
    });
    if (re != "") return;
    toast.success("Xử lý thành công");
    await updateTimeLineData();
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
    if (errorUpdateStatus) toast.error(errorUpdateStatus.message);
  }, [errorData, errorUpdateStatus]);
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        {isLoading ? (
          <span className="loading loading-infinity"></span>
        ) : !timeline ? (
          <div className="card-body">Lỗi tải dữ liệu</div>
        ) : (
          <>
            {/* Badge status */}
            <div className="">
              {timeline.info.name}
              <span className="badge badge-info text-white m-2">
                {timeline.status || "Chưa cập nhật"}
              </span>
            </div>
            <p className="mt-2 text-sm whitespace-pre-line">
              {timeline.info.description || "(Không có mô tả)"}
            </p>
            {/* Name + Assign */}
            <div className="flex justify-between items-center mt-4">
              {timeline.info.assignto_name ? (
                <>
                  <h3 className="font-bold text-lg">
                    {timeline.info.assignto_name}
                  </h3>
                  <div className="join">
                    <button
                      className="btn btn-outline join-item btn-primary tooltip"
                      onClick={() => handlerUpdateStatus("START")}
                      disabled={updateLoading}
                      data-tip="Bắt đầu"
                    >
                      <Play></Play>
                    </button>
                    <button
                      className="btn btn-outline join-item btn-success tooltip"
                      onClick={() => handlerUpdateStatus("END")}
                      disabled={updateLoading}
                      data-tip="Hoàn tất"
                    >
                      <CheckCheck />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <select
                    className="select"
                    value={userSelected}
                    onChange={(e) => setUserSelected(parseInt(e.target.value))}
                  >
                    <option value={0} disabled>
                      Chọn người chịu trách nhiệm
                    </option>
                    {users ? (
                      users.map((us) => (
                        <option value={us.userid} key={us.userid}>
                          {us.userData.display_name}
                        </option>
                      ))
                    ) : (
                      <option>Không tìm thấy dữ liệu</option>
                    )}
                  </select>
                  <button
                    className="btn btn-sm btn-outline rounded-full"
                    title="Phân công"
                    onClick={handleAssign}
                    disabled={loadingPut}
                  >
                    {loadingPut ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <Plus></Plus>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Description */}

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Ngày bắt đầu:</strong> {timeline.info.start_date}
              </p>
              <p>
                <strong>Ngày kết thúc:</strong> {timeline.info.end_date}
              </p>
              <p>
                <strong>Kết thúc thực tế:</strong>{" "}
                {timeline.info.actual_end || "--"}
              </p>
              <p>
                <strong>Tags:</strong> {timeline.info.tags?.join(", ") || "--"}
              </p>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
