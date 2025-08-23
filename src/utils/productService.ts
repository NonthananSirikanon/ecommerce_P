import { apiClient } from './api';
import type { Product, ProductsResponse, ProductsQueryParams, SingleProductResponse } from '../types/product';

export class ProductService {
  static async getProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    const { page = 1, limit = 10, search } = params;
    
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    
    if (search) {
      queryParams.search = search;
    }
    
    const queryString = new URLSearchParams(queryParams).toString();

    return apiClient.get<ProductsResponse>(`/simple-products?${queryString}`);
  }

  static async getFeaturedProducts(limit: number = 10): Promise<ProductsResponse> {
    return this.getProducts({
      page: 1,
      limit,
    });
  }

  static async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<SingleProductResponse>(`/simple-products/${id}`);
    return response.product;
  }
}