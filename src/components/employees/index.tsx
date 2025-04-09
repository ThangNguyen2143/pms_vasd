import { encodeBase64, getItem } from "~/lib/services";
import Emp_Table from "./emp_table";
import { FieldDto } from "~/lib/type";

function reshapeDataForTable(data: any[], fieldTable: FieldDto[]) {
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
function assignCreateUserForData(data: any[], userData: any[]) {
  if (!data || !userData) {
    return [];
  }

  return data.map((item) => {
    return {
      ...item,
      create_by: userData.find((user) => user.userid === item.create_by)
        ?.userData?.display_name,
    };
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

  if (!listEmployee?.value) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  const reshapedData = reshapeDataForTable(listEmployee.value, fieldTable);
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
  if (listGroup?.code !== 200) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  const reshapedData = reshapeDataForTable(listGroup.value, fieldTable);
  return <Emp_Table empData={reshapedData} feildTable={fieldTable} />;
}
async function TaskList({ project_id }: { project_id: number }) {
  // const project_id = "1"; // Thay thế bằng ID dự án thực tế
  const endpoint = "/tasks/" + encodeBase64({ project_id });
  const listGroup = await getItem({ endpoint });
  const endpointUser = "/user/" + encodeBase64({ type: "all" });
  const dataUser = await getItem({ endpoint: endpointUser });
  const fieldTable = [
    {
      code: "title",
      display: "Công việc",
    },
    {
      code: "description",
      display: "Mô tả",
    },
    {
      code: "create_by",
      display: "Người tạo",
    },
    {
      code: "dead_line",
      display: "Deadline",
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
  const listGroupWithUser = assignCreateUserForData(
    listGroup.value,
    dataUser?.value
  );
  const reshapedData = reshapeDataForTable(listGroupWithUser, fieldTable);
  return <Emp_Table empData={reshapedData} feildTable={fieldTable} />;
}
export { GroupTab, EmployeeTab, TaskList };
