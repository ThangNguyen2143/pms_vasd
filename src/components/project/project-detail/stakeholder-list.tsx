import { ProjectStakeholderDto } from "~/lib/types";

function StakeholderList({
  stakeholder,
}: {
  stakeholder?: ProjectStakeholderDto[];
}) {
  return (
    <div className="bg-base-200 p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold text-primary border-b border-base-content/20 pb-2 mb-4">
        🤝 Các bên liên quan
      </h2>

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
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-gray-500">
          Chưa có bên liên quan nào.
        </p>
      )}
    </div>
  );
}

export default StakeholderList;
