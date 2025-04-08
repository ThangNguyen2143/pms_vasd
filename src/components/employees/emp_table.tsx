import { FieldDto } from "~/lib/type";
import Dialog from "../ui/dialog";

function TableItem({ emp, feildTable }: { emp: any; feildTable: FieldDto[] }) {
  return (
    <tr>
      {feildTable.map((item, index) => {
        if (item.display == "Thao tác") {
          return (
            <td key={"-99"}>
              <Dialog
                nameBtn="Chi tiết"
                typeBtn="primary"
                title="Chi tiết"
                id={emp.id}
              >
                <div className="flex flex-col gap-4">
                  <label className="input">
                    <span className="label">Họ tên</span>
                    <input type="text" placeholder={emp[item.display]} />
                  </label>
                </div>
              </Dialog>
            </td>
          );
        } else if (item.display == "Trạng thái") {
          return (
            <td key={"-" + index}>
              <div className="badge">{emp[item.code] ? "Active" : "Block"}</div>
            </td>
          );
        }
        return (
          <td key={"-" + index}>{emp[item.code] ? emp[item.code] : ""}</td>
        );
      })}
    </tr>
  );
}
async function Emp_Table({
  empData,
  feildTable,
}: {
  empData: any[];
  feildTable: FieldDto[];
}) {
  if (!empData) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            {feildTable.map((item, index) => {
              return <th key={index}>{item.display}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {empData.map((item, index) => {
            return <TableItem emp={item} key={index} feildTable={feildTable} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Emp_Table;
