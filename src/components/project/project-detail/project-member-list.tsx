import { X } from "lucide-react";
import { ProjectMemberDto } from "~/lib/types";

function ProjectMemberList({
  project_member,
  project_id,
}: {
  project_member?: ProjectMemberDto[];
  project_id: number;
}) {
  return (
    <div>
      <button className="btn btn-primary">Thêm thành viên</button>
      <div>
        {project_member && project_member.length != 0 ? (
          <div>
            <ul className="list bg-base-100 rounded-box shadow-md">
              {project_member.map((member) => {
                return (
                  <li className="list-row" key={"project_member" + member.id}>
                    <div>{member.name}</div>

                    <div>
                      <div
                        tabIndex={0}
                        className="collapse border-base-300 border"
                      >
                        <div className="collapse-title font-semibold">
                          Xem quyền
                        </div>
                        <div className="collapse-content text-sm">
                          {member.role.map((r, i) => {
                            return (
                              <label
                                className="label"
                                key={i + "role" + member.id}
                              >
                                <input type="checkbox" className="checkbox" />
                                {r.display}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-square btn-ghost">
                      <X color="#f00" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div>Total member in project</div>
          </div>
        ) : (
          <div>Chưa có thành viên nào được thêm</div>
        )}
      </div>
    </div>
  );
}

export default ProjectMemberList;
