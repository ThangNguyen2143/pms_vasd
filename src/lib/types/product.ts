export type ProductDto = {
  id: string;
  name: string;
  description: string;
  create_by: number;
  status: string;
  createdAt: string;
};
export type ProductDetail = Omit<ProductDto, ""> & {
  modules: ProductModule[];
};
export type ProductModule = {
  id: string;
  code: string;
  display: string;
};
