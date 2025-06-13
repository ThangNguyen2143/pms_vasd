"use client";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateCriteria from "~/components/settings/requirement-criteria/update-modal";
import { useApi } from "~/hooks/use-api";
import { RequirementCritreia } from "~/lib/types";

function ClientRequirementCriteria() {
  const [showAddCriteria, setshowAddCriteria] = useState(false);
  const [showUpdateCriteria, setShowUpdateCriteria] = useState<number>(0);
  const [newCriteria, setNewCriteria] = useState<
    Exclude<RequirementCritreia, "scale">
  >({ code: "", description: "", is_active: true, title: "", weight: 1 });
  const { data: criteria, getData: getCriteria } =
    useApi<RequirementCritreia[]>();
  const { putData, errorData } = useApi<string, RequirementCritreia>();
  useEffect(() => {
    getCriteria(
      "/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfY3JpdGVyaWEifQ==",
      "default"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message || errorData.title);
  }, [errorData]);
  const handleAddCriteria = async (
    crit?: Exclude<RequirementCritreia, "scale">
  ) => {
    let payload = newCriteria;
    if (crit) payload = crit;
    payload.is_active = true;
    const re = await putData("/requirements/criteria", payload);
    if (re != "") return;
    toast.success("Xử lý thành công");
    await getCriteria(
      "/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfY3JpdGVyaWEifQ==",
      "reload"
    );
    if (crit) setShowUpdateCriteria(0);
    else setshowAddCriteria(false);
  };
  return (
    <div className="container overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Code</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Độ ưu tiên</th>
          </tr>
        </thead>
        <tbody>
          {criteria ? (
            criteria.map((crit, index) => {
              return (
                <tr key={crit.code}>
                  <td>
                    <label>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setShowUpdateCriteria(index)}
                      >
                        <Pencil></Pencil>
                      </button>
                    </label>
                  </td>
                  <td>{crit.code}</td>
                  <td>{crit.title}</td>
                  <td>{crit.description}</td>
                  <td>{crit.weight}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>Không thể tải dữ liệu</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          {showAddCriteria ? (
            <tr>
              <td>
                <button
                  className="btn btn-primary btn-outline"
                  onClick={() => handleAddCriteria()}
                >
                  Thêm
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => setshowAddCriteria(false)}
                >
                  Hủy
                </button>
              </td>
              <td>
                <label className="floating-label">
                  <span className="label">Code</span>
                  <input
                    type="text"
                    value={newCriteria.code}
                    placeholder="Code"
                    className="input"
                    onChange={(e) =>
                      setNewCriteria((pre) => ({
                        ...pre,
                        code: e.target.value,
                      }))
                    }
                  />
                </label>
              </td>
              <td>
                <label className="floating-label">
                  <span className="label">Tiêu đề</span>
                  <input
                    type="text"
                    value={newCriteria.title}
                    placeholder="Tiêu đề"
                    className="input"
                    onChange={(e) =>
                      setNewCriteria((pre) => ({
                        ...pre,
                        title: e.target.value,
                      }))
                    }
                  />
                </label>
              </td>
              <td>
                <label className="floating-label">
                  <span className="label">Mô tả</span>
                  <input
                    type="text"
                    value={newCriteria.description}
                    placeholder="Mô tả"
                    className="input"
                    onChange={(e) =>
                      setNewCriteria((pre) => ({
                        ...pre,
                        description: e.target.value,
                      }))
                    }
                  />
                </label>
              </td>
              <td>
                <label className="floating-label">
                  <span className="label">Độ ưu tiên</span>
                  <input
                    type="number"
                    value={newCriteria.weight}
                    placeholder="Độ ưu tiên"
                    className="input"
                    min={1}
                    onChange={(e) =>
                      setNewCriteria((pre) => ({
                        ...pre,
                        weight: parseInt(e.target.value),
                      }))
                    }
                  />
                </label>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={5}>
                <label>
                  <button
                    className="btn btn-primary"
                    onClick={() => setshowAddCriteria(true)}
                  >
                    + Thêm tiêu chí
                  </button>
                </label>
              </td>
            </tr>
          )}
        </tfoot>
      </table>
      {showUpdateCriteria != 0 && (
        <UpdateCriteria
          criterial={criteria ? criteria[showUpdateCriteria] : undefined}
          onUpdate={(crit) => handleAddCriteria(crit)}
          onClose={() => setShowUpdateCriteria(0)}
        />
      )}
    </div>
  );
}

export default ClientRequirementCriteria;
