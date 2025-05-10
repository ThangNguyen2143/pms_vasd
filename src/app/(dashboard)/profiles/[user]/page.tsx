import MainProfile from "~/components/profile/main-display";
import { fetchData } from "~/lib/api-client";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { DataResponse, UserDto } from "~/lib/types";

async function ProfileUserPage(props: { params: Promise<{ user: string }> }) {
  const params = await props.params;
  const user = decodeBase64(decodeURIComponent(params.user)) as { id: string };
  if (!user) {
    return <div>Không tìm thấy người dùng</div>;
  }
  const endpointUser = "/user/" + encodeBase64({ type: "info", id: user.id });
  const userdetail: DataResponse<UserDto> = await fetchData<UserDto>({
    endpoint: endpointUser,
    cache: "no-cache",
  });
  return <MainProfile user={userdetail.value} />;
}
export default ProfileUserPage;
