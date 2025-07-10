import { decodeBase64, encodeBase64 } from "~/lib/services";
import RequirementDetailClient from "../../requirement/[requirement]/requirment-detail-client";
import { fetchData } from "~/lib/api-client";
import { ProjectLocation, RequirementType } from "~/lib/types";
import { toast } from "sonner";

async function WorkDetailPage(prop: {
  params: Promise<{ work_detail: string }>;
}) {
  const { work_detail } = await prop.params;
  const { requirement_id, project_id } = decodeBase64(
    decodeURIComponent(work_detail)
  ) as {
    requirement_id: number;
    project_id: number;
  };
  const endpointTypeRequired =
    "/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfdHlwZSJ9";
  const requireTypeList = await fetchData<RequirementType[]>({
    endpoint: endpointTypeRequired,
    cache: "default",
  });
  const locationList = await fetchData<ProjectLocation[]>({
    endpoint: "/project/location/" + encodeBase64({ project_id }),
  });
  if (locationList.code == 404) {
    locationList.value = [];
  }
  if (locationList.code != 200 && locationList.code != 404) {
    toast.error(locationList.message);
    locationList.value = [];
  }
  let location = locationList.value;
  if (locationList.code == 200) {
    location = locationList.value.map((loca) => ({ ...loca, project_id }));
  }
  return (
    <RequirementDetailClient
      requirement_id={requirement_id}
      typeList={requireTypeList.value}
      project_id={project_id}
      locations={location}
    />
  );
}

export default WorkDetailPage;
