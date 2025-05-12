import { X } from "lucide-react";
import { ProjectStakeholderDto } from "~/lib/types";

function StakeholderList({
  stakeholder,
}: {
  stakeholder?: ProjectStakeholderDto[];
}) {
  if (!stakeholder || stakeholder.length == 0)
    return (
      <div className="bg-accent accent-accent-content">Danh sách trống</div>
    );
  return (
    <ul className="list">
      {stakeholder.map((stakholder) => {
        return (
          <li key={stakholder.code} className="list-row">
            <div>{stakholder.name}</div>
            <div>
              <div>{stakholder.description}</div>
              <div className="list-col-row">
                <p>Liên hệ:</p>
                {stakholder.contacts.map((contact, index) => {
                  return (
                    <p key={index + "" + stakholder.code + contact.code}>
                      {contact.code}:{contact.value}
                    </p>
                  );
                })}
              </div>
              <button className="btn btn-square btn-ghost">
                <X color="#f00" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default StakeholderList;
