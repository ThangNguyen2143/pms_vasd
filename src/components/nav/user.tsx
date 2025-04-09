import { logout } from "~/app/(auth)/login/actions/auth";

function UserIcon({ userName }: { userName: string }) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <div className="flex">{userName}</div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <a className="justify-between">Profile</a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a onClick={logout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}

export default UserIcon;
