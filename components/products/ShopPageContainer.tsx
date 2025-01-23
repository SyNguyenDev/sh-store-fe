"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import ProductViewChange from "../product/ProductViewChange";
import Pagination from "../others/Pagination";
import SingleProductListView from "@/components/product/SingleProductListView";
import { SearchParams } from "@/types";
import SingleProductCartView from "../product/SingleProductCartView";
import { Loader2 } from "lucide-react";
import Loader from "../others/Loader";
import { useQuery } from "@tanstack/react-query";
import { getProductListApi } from "@/apis/getProductList";
import { Product } from "@/types/product";

interface ShopPageContainerProps {
  searchParams: SearchParams;
  gridColumn?: number;
}

const ShopPageContainer = ({
  searchParams,
  gridColumn,
}: ShopPageContainerProps) => {
  const [listView, setListView] = useState(false);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [paginatedData, setPaginatedData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.page) || 1
  );
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["GetProductList", currentPage],
    queryFn: () => getProductListApi({ page: currentPage }),
  });

  const filterData = useCallback(() => {
    let filteredProducts = data?.products ?? [];

    if (searchParams.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === searchParams.category
      );
    }

    if (searchParams.brand) {
      filteredProducts = filteredProducts.filter(
        (product) => product?.brand === searchParams.brand
      );
    }

    if (searchParams.color) {
      filteredProducts = filteredProducts.filter((product) =>
        product?.color.includes(searchParams.color)
      );
    }

    if (searchParams.min && searchParams.max) {
      const minPrice = parseFloat(searchParams.min);
      const maxPrice = parseFloat(searchParams.max);
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    return filteredProducts;
  }, [
    data?.products,
    searchParams.brand,
    searchParams.category,
    searchParams.color,
    searchParams.max,
    searchParams.min,
  ]);

  useEffect(() => {
    const filteredProducts = filterData();
    setFilteredData(filteredProducts!);
  }, [filterData, filteredData.length, searchParams]);

  useEffect(() => {
    setCurrentPage(Number(searchParams.page) || 1);
  }, [searchParams.page]);

  useEffect(() => {
    const paginatedProducts = filteredData;
    console.log(paginatedProducts);

    setPaginatedData(paginatedProducts);
  }, [filteredData, currentPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
        <Loader2 className="animate-spin text-xl" size={50} />
        <p>Loading products..</p>
      </div>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4 text-xl mx-auto font-semibold space-y-4">
        <ProductViewChange
          listView={listView}
          setListView={setListView}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          itemPerPage={itemsPerPage}
          currentPage={currentPage}
        />
        <p>Sorry no result found with your filter selection</p>
      </div>
    );
  }

  return (
    <div className="md:ml-4 p-2 md:p-0">
      <ProductViewChange
        listView={listView}
        setListView={setListView}
        totalPages={Math.ceil(filteredData.length / itemsPerPage)}
        itemPerPage={itemsPerPage}
        currentPage={currentPage}
      />

      {listView === true && (
        <div className="max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 gap-4 lg:gap-6">
          {paginatedData.map((product) => (
            <SingleProductListView key={product.id} product={product} />
          ))}
        </div>
      )}

      {listView === false && (
        <div
          className={`max-w-screen-xl mx-auto overflow-hidden py-4 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${
            gridColumn || 3
          } overflow-hidden  gap-4 lg:gap-6`}
        >
          {paginatedData.map((product) => (
            <SingleProductCartView key={product.id} product={product} />
          ))}
        </div>
      )}

      <Suspense fallback={<Loader />}>
        <Pagination
          totalPages={Math.ceil((data?.total ?? 0) / itemsPerPage)}
          currentPage={currentPage}
          pageName="page"
        />
      </Suspense>
    </div>
  );
};

export default ShopPageContainer;
