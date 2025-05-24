import MainProfile from "~/components/profile/main-display";
// import { fetchData } from "~/lib/api-client";
import { decodeBase64 } from "~/lib/services";
// import { DataResponse, UserDto } from "~/lib/types";

async function ProfileUserPage(props: { params: Promise<{ user: string }> }) {
  const params = await props.params;
  const user = decodeBase64(decodeURIComponent(params.user)) as { id: number };
  if (!user) {
    return <div>Không tìm thấy người dùng</div>;
  }

  return <MainProfile user_id={user.id} />;
}
export default ProfileUserPage;
