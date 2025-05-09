export const metadata = {
  title: "Danh sách phần mềm",
  description: "Danh sách phần mềm của công ty TNHH MTV VASD",
};
import MainProductTable from "~/components/product/main-product-table";

function ProductsPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Danh sách phần mềm</h1>
      <MainProductTable />
    </main>
  );
}

export default ProductsPage;
