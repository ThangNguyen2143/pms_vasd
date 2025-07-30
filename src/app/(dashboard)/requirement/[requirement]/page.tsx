"use server";
import { RequirementType } from "~/lib/types";
import RequirementDetailClient from "./requirment-detail-client";
import { decodeBase64 } from "~/lib/services";
import { fetchData } from "~/lib/api-client";

async function RequirementDetailPage(prop: {
  params: Promise<{ requirement: string }>;
}) {
  const { requirement } = await prop.params;
  const { requirement_id } = decodeBase64(decodeURIComponent(requirement)) as {
    requirement_id: number;
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

export default RequirementDetailPage;
