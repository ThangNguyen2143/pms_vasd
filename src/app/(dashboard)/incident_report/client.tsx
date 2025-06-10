/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import IncidentList from "~/components/incident_report/incident-list";
import AddIncidentModal from "~/components/incident_report/modals/add-incident";
import IncidentDetailModal from "~/components/incident_report/modals/incident-detail-modal";
import UpdateIncidentInfoModal from "~/components/incident_report/modals/update-info-modal";
import SelectProject from "~/components/tasks/select-project";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import { Incident, IncidentDetail } from "~/lib/types";

function ClientIncidentPage() {
  const [selectProduct, setSelectProduct] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIncidentDetail, setShowIncidentDetail] = useState<number>();
  const [showUpdateDetail, setShowUpdateDetail] = useState(false);
  const { data, getData, isLoading, errorData } = useApi<Incident[]>();
  const {
    data: detailIncident,
    errorData: errorGetDetail,
    isLoading: loadDetail,
    getData: getDetailIncident,
  } = useApi<IncidentDetail>();
  const endpointIncidentList = (product_id: string) =>
    `/incident/${encodeBase64({ product_id })}`;
  const endpointIncidentDetail = (id: number) => {
    return `/incident/detail/${encodeBase64({ incident_id: id })}`;
  };
  useEffect(() => {
    if (selectProduct != "") getData(endpointIncidentList(selectProduct));
  }, [selectProduct]);
  useEffect(() => {
    if (showIncidentDetail)
      getDetailIncident(endpointIncidentDetail(showIncidentDetail), "reload");
  }, [showIncidentDetail]);
  useEffect(() => {
    if (errorGetDetail) toast.error(errorGetDetail.message);
  }, [errorGetDetail]);
  const reloadDetailData = async (id: number) => {
    await getDetailIncident(endpointIncidentDetail(id), "reload");
  };
  const reloadData = async () => {
    await getData(endpointIncidentList(selectProduct), "reload");
  };
  return (
    <div className="flex flex-col mt-4 gap-4">
      <div className="container flex justify-between gap-2.5">
        <SelectProject
          setProductSelect={setSelectProduct}
          productSelected={selectProduct}
        />
        {selectProduct == "" ? (
          ""
        ) : (
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Thêm sự kiện
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : errorData && errorData.code != 404 ? (
        <div className="alert alert-error justify-between">
          {errorData.message}
        </div>
      ) : (
        <div>
          <IncidentList
            product_id={selectProduct}
            incidentList={data || undefined}
            showIncidentDetail={(id) => {
              setShowIncidentDetail(id);
            }}
          />
        </div>
      )}
      {showAddModal && (
        <AddIncidentModal
          product_id={selectProduct}
          onClose={() => setShowAddModal(false)}
          onCreated={reloadData}
        />
      )}
      {showIncidentDetail && (
        <IncidentDetailModal
          incident={detailIncident || undefined}
          isLoading={loadDetail}
          onClose={() => setShowIncidentDetail(undefined)}
          onRemove={reloadData}
          onUpdate={() => reloadDetailData(showIncidentDetail)}
          updateInfo={() => {
            setShowUpdateDetail(true);
          }}
        />
      )}
      {showUpdateDetail && showIncidentDetail && (
        <UpdateIncidentInfoModal
          incident={detailIncident || undefined}
          onClose={() => setShowUpdateDetail(false)}
          onCreated={() => reloadDetailData(showIncidentDetail)}
        />
      )}
    </div>
  );
}

export default ClientIncidentPage;
