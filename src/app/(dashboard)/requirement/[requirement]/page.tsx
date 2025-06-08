"use server";
import { ProjectLocation, RequirementType } from "~/lib/types";
import RequirementDetailClient from "./requirment-detail-client";
import { decodeBase64, encodeBase64 } from "~/lib/services";
import { fetchData } from "~/lib/api-client";
import { toast } from "sonner";

async function RequirementDetailPage(prop: {
  params: Promise<{ requirement: string }>;
}) {
  const { requirement } = await prop.params;
  const { requirement_id, project_id } = decodeBase64(
    decodeURIComponent(requirement)
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
      locations={location}
    />
  );
}

export default RequirementDetailPage;
