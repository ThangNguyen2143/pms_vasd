/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Cake, Dna, Link, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Contact, UserDto } from "~/lib/types";
// import { UpdatedUserState } from "~/lib/definitions";
import { useApi } from "~/hooks/use-api";
import { toast } from "sonner";
import { encodeBase64 } from "~/lib/services";
type UserUpdate = {
  id: number;
  userData: {
    display_name: string;
    birthday: string;
    gender: string;
    contact: Contact[];
  };
};
type ContentWork = {
  id: number;
  title: string;
};
function MainProfile({ user_id }: { user_id: number }) {
  const { data: user, getData } = useApi<UserDto>();
  const [name, setName] = useState<string>(user?.userData.display_name || "");
  const [birthday, setBirthDay] = useState(user?.userData.birthday || "");
  const [listContacts, setlistContacts] = useState<Contact[]>([
    { code: "email", value: "" },
  ]);
  const [gender, setGender] = useState(user?.userData.gender || "");
  const { putData, isLoading, errorData } = useApi<"", UserUpdate>();
  const { getData: getWorkHistory, data } = useApi<{
    tasks: ContentWork[];
    bugs: ContentWork[];
    testcase: ContentWork[];
    restesting_bug: ContentWork[];
  }>();
  useEffect(() => {
    getData("/user/" + encodeBase64({ type: "info", id: user_id }), "reload");
    getWorkHistory("/dashboard/" + encodeBase64({ type: "working_histories" }));
  }, []);
  useEffect(() => {
    if (user) {
      setName(user?.userData.display_name);
      setBirthDay(user?.userData.birthday);
      setGender(user?.userData.gender);
      setlistContacts(user.userData.contact);
    }
  }, [user]);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleAddContact = () => {
    setlistContacts([...listContacts, { code: "email", value: "" }]);
  };
  const handleRemoveContact = (index: number) => {
    setlistContacts(listContacts.filter((_, i) => i !== index));
  };
  const handleContactChange = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    const newContacts = [...listContacts];
    newContacts[index][field] = value;
    setlistContacts(newContacts);
  };
  // const [state, action] = useActionState(HandlerUpdateUser, undefined);
  const handleSubmit = async () => {
    const dataSend: UserUpdate = {
      id: user_id,
      userData: {
        display_name: name,
        birthday: birthday,
        gender: gender,
        contact: listContacts,
      },
    };
    const re = await putData("/user/info", dataSend);
    if (re == "") toast.success("Cập nhật thông tin thành công");
  };
  return (
    <div className="font-sans antialiased leading-normal tracking-wider bg-cover flex items-center justify-center">
      <div className="max-w-4xl h-auto lg:h-screen mx-auto my-32 lg:my-0 flex justify-center gap-5">
        <div
          id="profile"
          className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl opacity-75 mx-6 lg:mx-0"
        >
          <div className="p-4 md:p-12 text-center lg:text-left flex flex-col gap-2 min-w-[400px]">
            <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"></div>
            <h1 className="text-3xl font-bold pt-8 lg:pt-0">
              Thông tin tài khoản
            </h1>
            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
            <label className="input">
              <span className="lable">
                <Tag size={36} className="h-4  text-green-700 pr-4" />
              </span>
              <input
                type="text"
                value={name}
                name="display_name"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="input">
              <span className="label">
                <Cake size={36} className="h-4  text-green-700 pr-4" />
              </span>
              <input
                type="date"
                value={birthday}
                name="birthday"
                onChange={(e) => setBirthDay(e.target.value)}
              />
            </label>
            <label className="select">
              <span className="label">
                <Dna size={36} className="h-4  text-green-700 pr-4" />
              </span>
              <select name="gender" defaultValue={gender}>
                <option
                  onClick={(e) => setGender(e.currentTarget.value)}
                  value={"male"}
                >
                  Nam
                </option>
                <option
                  onClick={(e) => setGender(e.currentTarget.value)}
                  value={"female"}
                >
                  Nữ
                </option>
              </select>
            </label>
            <div className="pt-2  lg:text-sm flex flex-col gap-1">
              <div className="flex">
                <Link size={36} className="h-4 text-green-700 pr-4" />
                Liên hệ
              </div>
              <fieldset className="fieldset">
                {listContacts.map((contact, index) => (
                  <div key={index} className="join">
                    <select
                      className="select join-item flex-1/4"
                      value={contact.code}
                      onChange={(e) =>
                        handleContactChange(index, "code", e.target.value)
                      }
                    >
                      <option value="email">Email</option>
                      <option value="phone">Số điện thoại</option>
                      <option value="zalo">Zalo</option>
                      <option value="telegram">Telegram</option>
                      <option value="other">Khác</option>
                    </select>
                    <input
                      type="text"
                      className="input join-item"
                      placeholder="Nhập liên hệ"
                      value={contact.value}
                      onChange={(e) =>
                        handleContactChange(index, "value", e.target.value)
                      }
                    />
                    {listContacts.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-error join-item"
                        onClick={() => handleRemoveContact(index)}
                      >
                        Xoá
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={handleAddContact}
                >
                  + Thêm liên hệ
                </button>
              </fieldset>
            </div>

            <div className="flex pt-12 pb-8 gap-2">
              <button
                className="btn btn-accent rounded-2xl"
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-6 w-full">
          <h3 className="text-xl font-bold mt-4">
            Lịch sử làm việc trong ngày
          </h3>
          {data ? (
            <div>
              {data.tasks && data.tasks.length > 0 && (
                <div>
                  <h4>Task</h4>
                  <ul className="list">
                    {data.tasks.map((task) => {
                      return (
                        <li key={task.id + "Htask"}>
                          {task.id}:{task.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {data.bugs && data.bugs.length > 0 && (
                <div>
                  <h4>Bug</h4>
                  <ul className="list">
                    {data.bugs.map((bug) => {
                      return (
                        <li key={bug.id + "Hbug"}>
                          {bug.id}:{bug.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {data.testcase && data.testcase.length > 0 && (
                <div>
                  <h4>Testcase</h4>
                  <ul className="list">
                    {data.testcase.map((test) => {
                      return (
                        <li key={test.id + "Htestcase"}>
                          {test.id}:{test.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {data.restesting_bug && data.restesting_bug.length > 0 && (
                <div>
                  <h4>Re-testing Bug</h4>
                  <ul className="list">
                    {data.restesting_bug.map((test) => {
                      return (
                        <li key={test.id + "Hretest-bug"}>
                          {test.id}:{test.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {data.bugs.length == 0 &&
                data.tasks.length == 0 &&
                data.testcase.length == 0 &&
                data.restesting_bug.length == 0 && (
                  <div>Không có công việc nào hoàn thành ngày hôm nay</div>
                )}
            </div>
          ) : (
            <div>Lỗi tải dữ liệu</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainProfile;
