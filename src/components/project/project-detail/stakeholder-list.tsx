"use client";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectStakeholderDto } from "~/lib/types";
import AddStakeholderModal from "./modals/add-stakeholder-modal";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { getUser } from "~/lib/dal";
import { toast } from "sonner";

function StakeholderList({
  project_id,
  stakeholder,
  onUpdate,
}: {
  project_id: number;
  stakeholder?: ProjectStakeholderDto[];
  onUpdate: () => Promise<void>;
}) {
  const [showAddStakeholderModal, setShowModal] = useState<boolean>(false);
  const { removeData, errorData, isLoading } = useApi<"">();
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handlerDelete = async () => {
    const user = await getUser();
    if (!user) {
      toast.error("Lỗi lấy dữ liệu người dùng");
      return;
    }
    const re = await removeData(
      "/project/stakeholders/" + encodeBase64({ project_id, code: user.code })
    );
    if (re != "") return;
    toast.success("Xóa thành viên liên quan thành công");
    await onUpdate();
  };
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <div className="text-primary border-b border-base-content/20 pb-2 mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold ">🤝 Các bên liên quan</h2>
        <button className="btn btn-ghost" onClick={() => setShowModal(true)}>
          <Plus />
        </button>
      </div>

      {stakeholder && stakeholder?.length > 0 ? (
        <div className="space-y-3">
          {stakeholder.map((s) => (
            <div key={s.code} className="bg-base-100 p-3 rounded border">
              <p>
                <span className="font-semibold">Tên:</span> {s.name}
              </p>
              <p>
                <span className="font-semibold">Mô tả:</span> {s.description}
              </p>
              <p>
                <span className="font-semibold">Ngày tạo:</span> {s.created}
              </p>
              <p>
                <span className="font-semibold">Liên hệ:</span>{" "}
                {s.contacts?.length > 0 ? (
                  <ul className="list-disc list-inside ml-4">
                    {s.contacts.map((c, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{c.code}:</span>{" "}
                        <a
                          href={
                            c.value.startsWith("http")
                              ? c.value
                              : `mailto:${c.value}`
                          }
                          className="text-blue-500 underline break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="italic text-gray-500">Không có liên hệ</span>
                )}
              </p>
              <div className="flex justify-end">
                <button
                  className="btn-error btn-outline tooltip btn-sm"
                  data-tip={"Xóa"}
                  disabled={isLoading}
                  onClick={handlerDelete}
                >
                  {isLoading ? (
                    <span className="loading loadingspinner"></span>
                  ) : (
                    <X />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-gray-500">
          Chưa có bên liên quan nào.
        </p>
      )}
      {showAddStakeholderModal && (
        <AddStakeholderModal
          project_id={project_id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default StakeholderList;
