import { apiClient } from './api';
import type { Product } from '../types/product';

export interface AdminProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SingleProductResponse {
  message: string;
  product: Product;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  inventory: {
    quantity: number;
  };
  image?: string; // Single base64 image string
  images?: string[]; // Multiple images (backwards compatibility)
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  inventory?: {
    quantity?: number;
  };
  image?: string; // Single base64 image string
  images?: string[]; // Multiple images (backwards compatibility)
  isActive?: boolean;
}

export interface UpdateProductResponse {
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  message: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string; // Keep for backward compatibility with existing API
  categoryName?: string; // New field for API v2
  status?: 'active' | 'inactive' | 'all';
  sort?: 'name' | '-name' | 'created_at' | '-created_at' | 'price' | '-price';
}

export interface BulkStatusUpdateRequest {
  productIds: string[];
  isActive: boolean;
}

export interface BulkStatusUpdateResponse {
  message: string;
  updatedCount: number;
}

export interface InventoryUpdateRequest {
  quantity?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
}

export interface InventoryUpdateResponse {
  message: string;
  product: Product;
}

export class AdminProductService {
  /**
   * Get all products for admin with pagination and filters
   */
  static async getProducts(params?: ProductQueryParams): Promise<AdminProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.sort) queryParams.append('sort', params.sort);

      const url = `/products/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Fetching products from:', `http://localhost:3001/api${url}`); // Debug log
      
      const response: unknown = await apiClient.get(url);
      console.log('Raw API Response:', response); // Debug log
      
      // Handle different possible response formats with type guards
      if (typeof response === 'object' && response !== null) {
        // Check if it's the new AdminProductsResponse format
        if ('products' in response && 'pagination' in response) {
          const typedResponse = response as AdminProductsResponse;
          if (Array.isArray(typedResponse.products)) {
            console.log('Found new AdminProductsResponse format with products array');
            return {
              products: typedResponse.products,
              pagination: {
                currentPage: typedResponse.pagination?.currentPage || params?.page || 1,
                totalPages: typedResponse.pagination?.totalPages || Math.ceil(typedResponse.products.length / (params?.limit || 20)),
                totalProducts: typedResponse.pagination?.totalProducts || typedResponse.products.length,
                hasNextPage: typedResponse.pagination?.hasNextPage || false,
                hasPrevPage: typedResponse.pagination?.hasPrevPage || false
              }
            };
          }
        }
        
        // Legacy format support - if has success and products
        if ('success' in response && 'products' in response) {
          const legacyResponse = response as { success: boolean; products: Product[]; pagination?: any };
          if (Array.isArray(legacyResponse.products)) {
            console.log('Found legacy response format, converting to new format');
            return {
              products: legacyResponse.products,
              pagination: {
                currentPage: params?.page || 1,
                totalPages: Math.ceil(legacyResponse.products.length / (params?.limit || 20)),
                totalProducts: legacyResponse.products.length,
                hasNextPage: false,
                hasPrevPage: false
              }
            };
          }
        }
        
        // Check if it's an array directly
        if (Array.isArray(response)) {
          return {
            products: response as Product[],
            pagination: {
              currentPage: params?.page || 1,
              totalPages: Math.ceil(response.length / (params?.limit || 20)),
              totalProducts: response.length,
              hasNextPage: false,
              hasPrevPage: false
            }
          };
        }
        
        // Check if data is nested in 'data' property
        if ('data' in response) {
          const dataResponse = response as { data: unknown };
          if (Array.isArray(dataResponse.data)) {
            return {
              products: dataResponse.data as Product[],
              pagination: {
                currentPage: params?.page || 1,
                totalPages: Math.ceil(dataResponse.data.length / (params?.limit || 20)),
                totalProducts: dataResponse.data.length,
                hasNextPage: false,
                hasPrevPage: false
              }
            };
          }
        }
      }
      
      // Fallback
      console.warn('API response format not recognized, returning empty result');
      return {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  static async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<SingleProductResponse>(`/products/${id}`);
    return response.product;
  }

  /**
   * Create a new product
   */
  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<CreateProductResponse>('/products', productData);
    return response.product;
  }

  /**
   * Update an existing product
   */
  static async updateProduct(id: string, productData: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<UpdateProductResponse>(`/products/${id}`, productData);
    return response.product;
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<void> {
    await apiClient.delete<DeleteProductResponse>(`/products/${id}`);
  }

  /**
   * Bulk update product status (active/inactive)
   */
  static async bulkUpdateStatus(request: BulkStatusUpdateRequest): Promise<BulkStatusUpdateResponse> {
    const response = await apiClient.patch<BulkStatusUpdateResponse>('/products/admin/bulk-status', request);
    return response;
  }

  /**
   * Update product inventory
   */
  static async updateInventory(productId: string, inventory: InventoryUpdateRequest): Promise<Product> {
    const response = await apiClient.patch<InventoryUpdateResponse>(`/products/admin/${productId}/inventory`, inventory);
    return response.product;
  }

  /**
   * Convert file to base64 for image upload
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Return full data URL with prefix (data:image/jpeg;base64,...)
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Validate product creation data
   */
  static validateCreateProduct(data: CreateProductRequest): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = 'กรุณาระบุชื่อสินค้า';
    }

    if (!data.description?.trim()) {
      errors.description = 'กรุณาระบุรายละเอียดสินค้า';
    }

    if (!data.price || data.price <= 0) {
      errors.price = 'ราคาต้องมากกว่า 0';
    }

    if (!data.inventory?.quantity || data.inventory.quantity < 0) {
      errors.quantity = 'จำนวนสต็อกต้องไม่น้อยกว่า 0';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Format price for display
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
    }).format(price);
  }

  /**
   * Generate SKU if not provided
   */
  static generateSKU(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    
    return `${cleanName.slice(0, 8)}-${timestamp}`;
  }
}