import { nxfetcherError } from './error/nxfetcherError';
import request from './fetcher/request';
import { setBaseUrl } from './config';

export { nxfetcherError, setBaseUrl };

export const nxfetcher = {
  get: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request<T>('GET', endpoint, undefined, options);
  },
  post: async <T>(endpoint: string, data: unknown, options?: RequestInit): Promise<T> => {
    return request<T>('POST', endpoint, data, options);
  },
  put: async <T>(endpoint: string, data: unknown, options?: RequestInit): Promise<T> => {
    return request<T>('PUT', endpoint, data, options);
  },
  patch: async <T>(endpoint: string, data: unknown, options?: RequestInit): Promise<T> => {
    return request<T>('PATCH', endpoint, data, options);
  },
  delete: async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request<T>('DELETE', endpoint, undefined, options);
  }
};
