import RequirementDetailClient from "./requirment-detail-client";
import { fetchData } from "~/lib/api-client";
import { RequirementDetail } from "~/lib/types";
import { notFound } from "next/navigation";

async function RequirementDetailPage(prop: {
  params: Promise<{ requirement: string }>;
}) {
  const { requirement } = await prop.params;
  // const {requirement_id} = decodeBase64(decodeURI(requirement)) as {requirement_id:string}
  const endpoint = "/requirements/detail/" + decodeURI(requirement);
  const requireData = await fetchData<RequirementDetail>({
    endpoint,
    cache: "default",
  });
  if (!requireData || requireData.code == 404) notFound();
  return <RequirementDetailClient requirement={requireData.value} />;
}

export default RequirementDetailPage;
