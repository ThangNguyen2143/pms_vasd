"use client";
import { useState } from "react";
import SelectProject from "../tasks/select-project";
import CreateTestcaseForm from "./modals/create-testcase-form";
import { useRouter } from "next/navigation";

function CreateTestcaseClient() {
  const route = useRouter();
  const [selectProduct, setSelectProduct] = useState("");
  return (
    <div className="container mt-4">
      <SelectProject
        setProductSelect={setSelectProduct}
        productSelected={selectProduct}
      />
      <CreateTestcaseForm product_id={selectProduct} onSuccess={route.back} />
    </div>
  );
}

export default CreateTestcaseClient;
