import { apiClient } from './api';
import type { ProductsResponse, ProductsQueryParams } from '../types/product';

export class ProductService {
  static async getProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    const { page = 1, limit = 100, search = 'product' } = params;
    
    const queryString = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: search,
    }).toString();

    return apiClient.get<ProductsResponse>(`/simple-products?${queryString}`);
  }

  static async getFeaturedProducts(limit: number = 8): Promise<ProductsResponse> {
    return this.getProducts({
      page: 1,
      limit,
      search: 'product',
    });
  }
}