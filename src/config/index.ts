let baseUrl: string = '';

export const setBaseUrl = (url: string): void => {
  baseUrl = url;
};

export const getBaseUrl = (): string => {
  if (!baseUrl) {
    throw new Error('Base URL is not set. Use setBaseUrl() before making requests.');
  }
  return baseUrl;
};
