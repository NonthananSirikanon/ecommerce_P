export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string; // Keep for backward compatibility
  images?: string[]; // New field for multiple images
  stock?: number; // Make optional since inventory might be tracked separately
  category?: string; // Keep for backward compatibility
  categoryId?: string; // New field
  categoryName?: string; // New field for API v2
  quantity?: number;
  totalPrice?: number;
  sku?: string;
  brand?: string;
  tags?: string[];
  inventory?: {
    quantity: number;
    trackInventory: boolean;
    lowStockThreshold?: number;
  };
  // Additional pricing fields
  comparePrice?: number;
  cost?: number;
  // Physical properties
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  // Additional admin fields
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
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

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}