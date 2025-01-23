import axiosInstance from "@/configs/axios";
import { GetProductsResponse } from "@/types/product";

export const getProductListApi = async ({ page }: { page: number }) => {
  const response = await axiosInstance.get<GetProductsResponse>(
    `product?page=${page}&limit=10`
  );
  return response.data;
};
