import { decodeBase64 } from "~/lib/services";
import RequirementDetailClient from "../../requirement/[requirement]/requirment-detail-client";
import { fetchData } from "~/lib/api-client";
import { RequirementType } from "~/lib/types";

async function WorkDetailPage(prop: {
  params: Promise<{ work_detail: string }>;
}) {
  const { work_detail } = await prop.params;
  const { requirement_id } = decodeBase64(decodeURIComponent(work_detail)) as {
    requirement_id: number;
    project_id: number;
  };
  const endpointTypeRequired =
    "/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfdHlwZSJ9";
  const requireTypeList = await fetchData<RequirementType[]>({
    endpoint: endpointTypeRequired,
    cache: "default",
  });

  return (
    <RequirementDetailClient
      requirement_id={requirement_id}
      typeList={requireTypeList.value}
    />
  );
}

export default WorkDetailPage;
