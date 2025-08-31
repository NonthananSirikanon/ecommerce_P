import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000, 
    maxRedirects: 3,
  });

  private activeRequests = new Map<string, Promise<unknown>>();
  private requestQueue: Array<{ fn: () => Promise<unknown>; resolve: (value: unknown) => void; reject: (error: Error) => void }> = [];
  private concurrentRequests = 0;
  private readonly maxConcurrentRequests = 4; 
  private readonly requestDelay = 100; 
  private lastRequestTime = 0;

  constructor() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
        
        if (error.code === 'ERR_INSUFFICIENT_RESOURCES' || error.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
          errorMessage = 'ทรัพยากรระบบไม่เพียงพอ กรุณาลองใหม่อีกสักครู่';
        } else if (error.response?.status === 429) {
          errorMessage = 'มีการเรียกใช้งาน API มากเกินไป กรุณาลองใหม่อีกสักครู่';
        } else if (error.response?.status === 500) {
          errorMessage = 'เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่อีกครั้ง';
        } else if (error.response?.data) {
          const errorData = error.response.data as { message?: string; error?: string };
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }
    );
  }

  private generateRequestKey(method: string, endpoint: string, data?: unknown): string {
    const dataString = data ? JSON.stringify(data) : '';
    return `${method}:${endpoint}:${dataString}`;
  }

  private async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestDelay) {
      await this.sleep(this.requestDelay - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
  }

  private async executeWithConcurrencyLimit<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const executeRequest = async () => {
        try {
          this.concurrentRequests++;
          await this.throttleRequest();
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.concurrentRequests--;
          this.processQueue();
        }
      };

      if (this.concurrentRequests < this.maxConcurrentRequests) {
        executeRequest();
      } else {
        this.requestQueue.push({
          fn: requestFn,
          resolve: resolve as (value: unknown) => void,
          reject,
        });
      }
    });
  }

  private processQueue(): void {
    if (this.requestQueue.length > 0 && this.concurrentRequests < this.maxConcurrentRequests) {
      const { fn, resolve, reject } = this.requestQueue.shift()!;
      
      const executeRequest = async () => {
        try {
          this.concurrentRequests++;
          await this.throttleRequest();
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error as Error);
        } finally {
          this.concurrentRequests--;
          this.processQueue();
        }
      };

      executeRequest();
    }
  }

  private async deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    const existingRequest = this.activeRequests.get(key);
    
    if (existingRequest) {
      return existingRequest as Promise<T>;
    }

    const promise = this.executeWithConcurrencyLimit(requestFn);
    this.activeRequests.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.activeRequests.delete(key);
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error = new Error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (error instanceof Error && error.message.includes('401') || 
            error instanceof Error && error.message.includes('403')) {
          throw error;
        }
        
        const shouldRetry = error instanceof Error && (
          error.message.includes('มีการเรียกใช้งาน API มากเกินไป') ||
          error.message.includes('เซิร์ฟเวอร์มีปัญหา') ||
          error.message.includes('ทรัพยากรระบบไม่เพียงพอ') ||
          error.message.includes('Network Error') ||
          error.message.includes('timeout') ||
          error.message.includes('ERR_INSUFFICIENT_RESOURCES')
        );
        
        if (!shouldRetry || attempt === maxRetries) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  async get<T>(endpoint: string): Promise<T> {
    const key = this.generateRequestKey('GET', endpoint);
    return this.deduplicateRequest(key, () => 
      this.retryRequest(async () => {
        const response = await this.client.get(endpoint);
        return response.data;
      })
    );
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const key = this.generateRequestKey('POST', endpoint, data);
    return this.deduplicateRequest(key, () =>
      this.retryRequest(async () => {
        const response = await this.client.post(endpoint, data);
        return response.data;
      })
    );
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const key = this.generateRequestKey('PUT', endpoint, data);
    return this.deduplicateRequest(key, () =>
      this.retryRequest(async () => {
        const response = await this.client.put(endpoint, data);
        return response.data;
      })
    );
  }

  async delete<T>(endpoint: string): Promise<T> {
    const key = this.generateRequestKey('DELETE', endpoint);
    return this.deduplicateRequest(key, () =>
      this.retryRequest(async () => {
        const response = await this.client.delete(endpoint);
        return response.data;
      })
    );
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const key = this.generateRequestKey('PATCH', endpoint, data);
    return this.deduplicateRequest(key, () =>
      this.retryRequest(async () => {
        const response = await this.client.patch(endpoint, data);
        return response.data;
      })
    );
  }
}

export const apiClient = new ApiClient();