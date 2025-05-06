import AddProductBtn from "~/components/product/add-product";
import ProductTable from "~/components/product/product-table";

function ProductsPage() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex justify-end">
          <AddProductBtn></AddProductBtn>
        </div>
      </div>
      <ProductTable />
    </main>
  );
}

export default ProductsPage;
