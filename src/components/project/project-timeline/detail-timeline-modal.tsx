"use client";
import { CheckCheck, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import {
  Contact,
  ProjectTimeLine,
  ProjectTimeLineDetail,
  UserDto,
} from "~/lib/types";
import { sendEmail } from "~/utils/send-notify";
import UpdateInfoForm from "./update-info-timeline";
import SafeHtmlViewer from "~/components/ui/safeHTMLviewer";
interface ResponseNotify {
  action: string;
  content: {
    timeline_id: number;
    timeline_name: string;
    message: string;
  };
  contact: Contact[];
}
interface UpdateTimelinneData {
  project_id: number; //ID dự án (truyền từ component cha)
  phase_id: number; //ID giai đoạn (truyền từ component cha)
  name: string; //Tên công việc
  description: string; //Mô tả công việc
  start_date: string; // Ngầy bắt đầu
  end_date: string; //Ngày kết thúc
  parent_id?: number;
  weight: number; //Trọng số (Mức độ quan trọng), kiểu Number. Type input range
  tags: string[]; //Nhãn (Để đánh dấu công việc)
}
export default function TimelineDetailModal({
  timeline_id,
  timeLineList,
  onClose,
  onUpdate,
}: {
  timeline_id: number;
  timeLineList: ProjectTimeLine[];
  onClose: () => void;
  onUpdate: (phase_id: number) => Promise<void>;
}) {
  const [userSelected, setUserSelected] = useState(0);
  const [updateShow, setupdateShow] = useState(false);
  const {
    getData: getTimeLine,
    data: timeline,
    isLoading,
  } = useApi<ProjectTimeLineDetail>();
  const { getData: getUser, data: users } = useApi<UserDto[]>();
  const {
    putData: assignUser,
    isLoading: loadingPut,
    errorData,
  } = useApi<ResponseNotify, { timeline_id: number; user_id: number }>();

  const {
    putData: updateStatus,
    isLoading: updateLoading,
    errorData: errorUpdateStatus,
  } = useApi<string, { timeline_id: number; status: string }>();
  const {
    putData: updateInfoTimeLine,
    isLoading: loadUpdate,
    errorData: errorUpdateInfo,
  } = useApi<string, UpdateTimelinneData>();
  const { removeData } = useApi<string>();
  useEffect(() => {
    getTimeLine("/project/timeline/detail/" + encodeBase64({ timeline_id }));
    getUser("/user/" + encodeBase64({ type: "all" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline_id]);
  const updateTimeLineData = async () => {
    await getTimeLine("/project/timeline/" + encodeBase64({ timeline_id }));
  };
  const deleteTimeline = async () => {
    const re = await removeData(
      "/project/timeline/" + encodeBase64({ timeline_id })
    );
    if (re != "") toast.error("Không thể xóa timeline");
    toast.success("Xử lý thành công");
    if (timeline) {
      await onUpdate(timeline?.phase_id);

      onClose();
    }
  };
  const handleAssign = async () => {
    if (!timeline) return;
    const dataSend = {
      timeline_id,
      user_id: userSelected,
    };
    const re = await assignUser("/project/timeline/assign", dataSend);
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
    }
  };
  const handlerUpdateStatus = async (status: string) => {
    const re = await updateStatus("/project/timeline/status", {
      timeline_id,
      status,
    });
    if (re != "") return;
    toast.success("Xử lý thành công");
    await getTimeLine(
      "/project/timeline/detail/" + encodeBase64({ timeline_id }),
      "reload"
    );
    await updateTimeLineData();
  };
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
    if (errorUpdateStatus) toast.error(errorUpdateStatus.message);
    if (errorUpdateInfo) toast.error(errorUpdateInfo.message);
  }, [errorData, errorUpdateStatus, errorUpdateInfo]);
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
        ) : updateShow ? (
          <UpdateInfoForm
            onClose={() => setupdateShow(false)}
            onPut={async (data) => {
              return await updateInfoTimeLine("/project/timeline", data);
            }}
            timelineData={timeline}
            timelineList={timeLineList}
            isLoading={loadUpdate}
          />
        ) : (
          <>
            {/* Badge status */}
            <div className="">
              {timeline.info.name}
              <span className="badge badge-info text-white m-2">
                {timeline.status || "Chưa cập nhật"}
              </span>
            </div>
            <div className="mt-2 text-sm whitespace-pre-line">
              <SafeHtmlViewer
                html={timeline.info.description || "(Không có mô tả)"}
              />
            </div>
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
            <div className="modal-action">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setupdateShow(true)}
              >
                Chỉnh sửa
              </button>
              <button
                className="btn btn-outline btn-error"
                onClick={deleteTimeline}
              >
                Xóa timeline
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
