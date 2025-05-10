"use client";
import { Cake, Dna, Link, Tag } from "lucide-react";
import { useActionState, useState } from "react";
import { UserDto } from "~/lib/types";
import { HandlerUpdateUser } from "./action";

function MainProfile({ user }: { user: UserDto }) {
  const [name, setName] = useState(user.userData.display_name);
  const [birthday, setBirthDay] = useState(user.userData.birthday);
  const [email, setEmail] = useState(user.userData.contact[0]?.value || "");
  const [telegram, setTelegram] = useState(
    user.userData.contact[1]?.value || ""
  );
  const [gender, setGender] = useState(user.userData.gender);
  const [state, action] = useActionState(HandlerUpdateUser, undefined);
  return (
    <div className="font-sans antialiased text-gray-900 leading-normal tracking-wider bg-cover">
      <form action={action}>
        <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
          <div
            id="profile"
            className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
          >
            <input
              type="number"
              className="hidden"
              value={user.userid}
              readOnly
              name="id"
            />
            <div className="p-4 md:p-12 text-center lg:text-left flex flex-col gap-2">
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
                {state?.errors?.display_name && (
                  <span className="text-red-500 text-sm">
                    {state.errors.display_name}
                  </span>
                )}
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
                {state?.errors?.birthday && (
                  <span className="text-red-500 text-sm">
                    {state.errors.birthday}
                  </span>
                )}
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
              <div className="pt-2 text-gray-600 text-xs lg:text-sm flex flex-col gap-1">
                <div className="flex">
                  <Link size={36} className="h-4 text-green-700 pr-4" />
                  Liên hệ
                </div>
                <label className="input">
                  <span className="label">Email</span>
                  <input
                    type="text"
                    placeholder={"Email của bạn"}
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {state?.errors?.email && (
                    <span className="text-red-500 text-sm">
                      {state.errors.email}
                    </span>
                  )}
                </label>
                <label className="input">
                  <span className="label">Telegram</span>
                  <input
                    type="text"
                    placeholder={"Telegram ID của bạn"}
                    value={telegram}
                    name="telegram"
                    onChange={(e) => setTelegram(e.target.value)}
                  />
                </label>
                {state?.errors?.telegram && (
                  <span className="text-red-500 text-sm">
                    {state.errors.telegram}
                  </span>
                )}
              </div>

              <div className="flex pt-12 pb-8 gap-2">
                <button className="btn btn-accent rounded-2xl" type="submit">
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MainProfile;
