export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  quantity: number;
  totalPrice: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: Pagination;
  count: number;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}