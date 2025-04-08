import { encodeBase64, getItem } from "~/lib/services";
import Emp_Table from "./emp_table";
import { FieldDto } from "~/lib/type";

function reshapeData(data: any[], fieldTable: FieldDto[]) {
  return data.map((item) => {
    const reshapedItem: any = {};
    fieldTable.forEach((field) => {
      if (field.sub) {
        reshapedItem[field.code] = item[field.sub][field.code];
      } else {
        reshapedItem[field.code] = item[field.code];
      }
    });
    return reshapedItem;
  });
}
async function EmployeeTab() {
  const endpoint = "/user/" + encodeBase64({ type: "all" });
  const listEmployee = await getItem({ endpoint });
  const fieldTable = [
    {
      code: "display_name",
      sub: "userData",
      display: "Họ tên",
    },
    {
      code: "isActive",
      sub: "accountData",
      display: "Trạng thái",
    },
    {
      code: "account_type",
      sub: "accountData",
      display: "Vai trò",
    },
    {
      code: "group",
      display: "Nhóm",
    },
    {
      code: "",
      display: "Thao tác",
    },
  ];

  if (!listEmployee) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  const reshapedData = reshapeData(listEmployee, fieldTable);
  return <Emp_Table empData={reshapedData} feildTable={fieldTable} />;
}

async function GroupTab() {
  const endpoint = "/group/" + encodeBase64({ type: "all" });
  const listGroup = await getItem({ endpoint });
  const fieldTable = [
    {
      code: "group_name",
      display: "Tên nhóm",
    },
    {
      code: "group_description",
      display: "Mô tả",
    },
    {
      code: "status",
      display: "Trạng thái",
    },
    {
      code: "",
      display: "Thao tác",
    },
  ];
  if (!listGroup) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  const reshapedData = reshapeData(listGroup, fieldTable);
  return <Emp_Table empData={reshapedData} feildTable={fieldTable} />;
}
export { GroupTab, EmployeeTab };
