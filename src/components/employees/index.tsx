/* eslint-disable @typescript-eslint/no-explicit-any */
import { encodeBase64, getItem } from "~/lib/services";
import Emp_Table from "./emp_table";
import { AccountType, Contact, FieldDto, GroupDto, UserDto } from "~/lib/type";
import { fetchData } from "~/lib/api-client";
import Group_Table from "./group/group-table";

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
function assignCreateUserForData(data: any[], userData: UserDto[]) {
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
async function assignTypeAccountForData(
  data: UserDto[],
  typeAccount: AccountType[]
) {
  if (!data || !typeAccount) {
    return [];
  }

  const res: any[] = [];
  for (let index = 0; index < data.length; index++) {
    const result = await assignRoleForData(data[index]);
    res.push({
      ...result,
      accountData: {
        ...data[index].accountData,
        account_type: typeAccount.find(
          (type) => type.code === data[index].accountData.account_type
        )?.display,
      },
    });
  }
  return res;
}
async function assignRoleForData(data: UserDto) {
  const endpoint =
    "/user/" + encodeBase64({ type: "role", code: data.accountData.code });
  const userRoleRespone = await fetchData<Contact[]>({
    endpoint,
    cache: "no-cache",
  });
  if (userRoleRespone.code != 200)
    return {
      ...data,
      roles: "",
    };
  return {
    ...data,
    roles: userRoleRespone.value,
  };
}
async function EmployeeTab({ typeAccount }: { typeAccount?: AccountType[] }) {
  if (!typeAccount) {
    const endpointType =
      "/system/config/" + encodeBase64({ type: "account_type" });
    const getTypeAccount = await fetchData<AccountType[]>({
      endpoint: endpointType,
    });
    if (getTypeAccount.code === 200) {
      typeAccount = getTypeAccount.value;
    }
    return <div className="alert alert-error">Không có dữ liệu vai trò</div>;
  }
  const roleRespone = await fetchData<Contact[]>({
    endpoint: "/system/config/eyJ0eXBlIjoicm9sZSJ9",
    cache: "force-cache",
  });
  const endpoint = "/user/" + encodeBase64({ type: "all" });
  const listEmployee = await fetchData<UserDto[]>({
    endpoint,
    cache: "reload",
  });
  const fieldTable = [
    {
      code: "username",
      sub: "accountData",
      display: "Khởi tạo",
    },
    {
      code: "display_name",
      sub: "userData",
      display: "Họ tên",
    },
    {
      code: "account_type",
      sub: "accountData",
      display: "Vai trò",
    },
    {
      code: "roles",
      display: "Cấp quyền",
    },
    {
      code: "userid",
      display: "Khóa",
    },
    {
      code: "isActive",
      sub: "accountData",
      display: "Trạng thái",
    },
  ];

  if (!listEmployee?.value) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }

  const listEmployeeWithType = await assignTypeAccountForData(
    listEmployee.value,
    typeAccount
  );
  // const reshapedData = reshapeDataForTable(listEmployeeWithType, fieldTable);
  return (
    <Emp_Table
      empData={listEmployeeWithType}
      feildTable={fieldTable}
      typeAccount={typeAccount}
      roleList={roleRespone.value}
    />
  );
}

async function GroupTab() {
  const endpoint = "/group/" + encodeBase64({ type: "all" });
  const listGroup = await fetchData<GroupDto[]>({
    endpoint,
    cache: "no-store",
  });
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
      code: "group_id",
      display: "Thao tác",
    },
  ];
  if (listGroup?.code !== 200) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  return <Group_Table groupData={listGroup.value} feildTable={fieldTable} />;
}
async function TaskList({ project_id }: { project_id: number }) {
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
  if (!listGroup || listGroup.code == 404) {
    return <div className="alert alert-error">Không có dữ liệu</div>;
  }
  const listGroupWithUser = assignCreateUserForData(
    listGroup.value,
    dataUser?.value
  );
  const reshapedData = reshapeDataForTable(listGroupWithUser, fieldTable);
  return <Emp_Table empData={reshapedData} feildTable={fieldTable} />;
} //Chưa fix
export { GroupTab, EmployeeTab, TaskList };
