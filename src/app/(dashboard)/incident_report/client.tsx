"use client";
import { useState } from "react";
import AddIncidentModal from "~/components/incident_report/modals/add-incident";
import SelectProject from "~/components/tasks/select-project";

function ClientIncidentPage() {
  const [selectProduct, setSelectProduct] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
      {showAddModal && (
        <AddIncidentModal
          product_id={selectProduct}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
}

export default ClientIncidentPage;
