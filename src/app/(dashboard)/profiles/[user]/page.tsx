import MainProfile from "~/components/profile/main-display";
import { fetchData } from "~/lib/api-client";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { DataResponse, UserDto } from "~/lib/type";

async function ProfileUserPage(props: { params: Promise<{ user: string }> }) {
  const params = await props.params;
  const endpointUser =
    "/user/" + encodeBase64({ type: "info", id: decodeBase64(params.user).id });
  const userdetail: DataResponse<UserDto> = await fetchData<UserDto>({
    endpoint: endpointUser,
    cache: "no-cache",
  });
  return <MainProfile user={userdetail.value} />;
}
export default ProfileUserPage;
