import { nxfetcherError } from '../error/nxfetcherError';
import { getBaseUrl } from '../config';

// Use the native RequestInit from TypeScript
interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: unknown,
  options: FetchOptions = {}
): Promise<T> => {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}), // Merge with additional headers
    },
    ...options
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const retries = options.retries || 3;
  const retryDelay = options.retryDelay || 1000;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(getBaseUrl() + endpoint, config);

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorBody = await response.json();
            errorMessage += `: ${JSON.stringify(errorBody)}`;
          } else {
            const errorText = await response.text();
            errorMessage += `: ${errorText}`;
          }
        } catch (innerError) {
          errorMessage += `: Unable to parse error response.`;
        }
        throw new nxfetcherError(errorMessage);
      }

      if (contentType && contentType.includes('application/json')) {
        return await response.json() as Promise<T>;
      } else {
        throw new nxfetcherError(`Expected JSON response but received: ${contentType || 'unknown content type'}`);
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        if (attempt < retries) {
          console.log(`[nxfetcher] Retry attempt ${attempt + 1} for ${method} ${endpoint}`);
          await new Promise(resolve => setTimeout(resolve, retryDelay)); // Delay before retrying
        } else {
          throw new nxfetcherError(`[nxfetcher] ${method} ${endpoint} failed after ${retries + 1} attempts: ${error.message}`);
        }
      } else {
        throw new nxfetcherError(`[nxfetcher] ${method} ${endpoint} failed: Unknown error`);
      }
    }
  }
};

export default request;
