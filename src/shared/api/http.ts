const DEFAULT_TIMEOUT = 15000;

function getBaseURL() {
  const config = useRuntimeConfig();

  return config.public.apiUrl || '';
}

async function request<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

  const baseURL = getBaseURL();
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };
    }

    const data = await response.json().catch(() => null);
    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export const api = {
  get: <T = any>(url: string, options?: RequestInit): Promise<T> => {
    return request<T>(url, { ...options, method: 'GET' });
  },

  post: <T = any>(url: string, body?: any, options?: RequestInit): Promise<T> => {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};

export default api;

