// change or modify the types as your requirement

import { Product } from "./types/product";

export type SearchParams = {
  page: string;
  category: string;
  brand: string;
  search: string;
  min: string;
  max: string;
  color: string;
};

export type CartItem = Product & {
  selectedColor: string;
  quantity: number;
};
