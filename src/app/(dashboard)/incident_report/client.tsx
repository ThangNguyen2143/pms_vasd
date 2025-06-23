/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Search } from "lucide-react";
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
  const [findIncident, setFindIncident] = useState("");
  const [incidentList, setIncidentList] = useState([] as Incident[]);

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
    if (data) {
      setIncidentList(data);
    } else setIncidentList([]);
  }, [data]);
  useEffect(() => {
    if (data) {
      const filteredIncident = data.filter((incident) => {
        return findIncident
          ? incident.id === parseInt(findIncident) ||
              incident.title.toLowerCase().includes(findIncident.toLowerCase())
          : true;
      });
      setIncidentList(filteredIncident);
    }
  }, [findIncident, data]);
  useEffect(() => {
    if (selectProduct != "") getData(endpointIncidentList(selectProduct));
  }, [selectProduct]);
  useEffect(() => {
    if (showIncidentDetail)
      getDetailIncident(endpointIncidentDetail(showIncidentDetail), "reload");
  }, [showIncidentDetail]);
  useEffect(() => {
    if (errorGetDetail)
      toast.error(errorGetDetail.message || errorGetDetail.title);
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
            className="btn btn-info"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm sự kiện
          </button>
        )}
      </div>
      <div className="flex justify-start">
        <label className="input">
          <input
            placeholder="Nhập tên, id sự cố"
            type="text"
            value={findIncident}
            onChange={(e) => setFindIncident(e.target.value)}
          />
          <span className="label">
            <Search></Search>
          </span>
        </label>
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
            incidentList={incidentList}
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
